import { NextRequest, NextResponse } from 'next/server';
import { isSlotAllowedForNoise } from '@/lib/utils/noiseCheck';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { client_name, client_phone, space_id, start_time, end_time, is_noisy, total_amount, deposit_amount } = body;

    if (!client_name || !client_phone || !space_id || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'Paramètres obligatoires manquants.' },
        { status: 400 }
      );
    }

    // 1. Règle bruit Sabar/Batterie (10h-19h Lun-Sam)
    if (is_noisy) {
      const noiseCheck = isSlotAllowedForNoise(start_time, end_time);
      if (!noiseCheck.allowed) {
        return NextResponse.json(
          { error: noiseCheck.reason },
          { status: 422 }
        );
      }
    }

    // 2. Génération numéro de réservation unique
    const bookingNumber = `7T-BK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    return NextResponse.json({
      success: true,
      booking: {
        id: `bk-${Date.now()}`,
        booking_number: bookingNumber,
        client_name,
        client_phone,
        space_id,
        start_time,
        end_time,
        total_amount,
        deposit_amount,
        status: 'confirmee',
        created_at: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}
