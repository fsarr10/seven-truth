import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { item_name, item_price, currency, ref_command, client_phone } = body;

    const apiKey = process.env.PAYTECH_API_KEY || 'demo_paytech_key';
    const apiSecret = process.env.PAYTECH_API_SECRET || 'demo_paytech_secret';

    // Simulation de création d'URL de redirection PayTech Sénégal (Wave / Orange Money)
    const token = crypto.randomBytes(16).toString('hex');
    const redirectUrl = `https://paytech.sn/payment/checkout/${token}`;

    return NextResponse.json({
      success: true,
      token,
      redirect_url: redirectUrl,
      ref_command: ref_command || `7T-REF-${Date.now()}`
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Erreur passerelle paiement' },
      { status: 500 }
    );
  }
}
