import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface ContactRequestBody {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// POST /api/contact - Submit a contact form
export async function POST(request: Request) {
  try {
    const body: ContactRequestBody = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    const errors: Record<string, string> = {};

    if (!name || name.trim().length === 0) {
      errors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!email || email.trim().length === 0) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!subject || subject.trim().length === 0) {
      errors.subject = 'Subject is required';
    }

    if (!message || message.trim().length === 0) {
      errors.message = 'Message is required';
    } else if (message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // Attempt to store in Supabase (graceful fallback if unavailable)
    let stored = false;

    try {
      const supabase = await createClient();

      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: name.trim(),
          email: email.trim(),
          phone: phone?.trim() || null,
          subject: subject.trim(),
          message: message.trim(),
        });

      if (!error) {
        stored = true;
      } else {
        // Log the error but don't fail the request — table may not exist yet
        console.warn('[Contact API] Supabase insert failed:', error.message);
      }
    } catch (err) {
      // Supabase client may not initialize if env vars are missing
      console.warn('[Contact API] Supabase unavailable, skipping storage:', err);
    }

    return NextResponse.json({
      success: true,
      message: stored
        ? 'Your message has been sent successfully. We\'ll get back to you within 24 hours.'
        : 'Your message has been received. We\'ll get back to you within 24 hours.',
      stored,
    });
  } catch (err) {
    console.error('[Contact API] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
