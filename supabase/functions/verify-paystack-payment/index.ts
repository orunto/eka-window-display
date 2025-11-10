import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyPaymentRequest {
  reference: string;
  orderId: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reference, orderId }: VerifyPaymentRequest = await req.json();
    
    console.log('Verifying payment:', { reference, orderId });

    // Get Paystack secret key from site settings
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch Paystack secret key from site_settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from('site_settings')
      .select('value')
      .eq('key', 'paystack_secret_key_ngn')
      .single();

    if (settingsError || !settings) {
      throw new Error('Paystack secret key not configured');
    }

    const paystackSecretKey = settings.value;

    // Verify payment with Paystack
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      }
    );

    const verificationData = await verifyResponse.json();
    console.log('Paystack verification response:', verificationData);

    if (!verifyResponse.ok || !verificationData.status) {
      throw new Error('Payment verification failed');
    }

    const paymentData = verificationData.data;

    // Check if payment was successful
    if (paymentData.status === 'success') {
      // Update order status to 'paid'
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ 
          status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Error updating order:', updateError);
        throw updateError;
      }

      console.log('Order updated successfully:', orderId);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Payment verified and order updated',
          paymentStatus: paymentData.status,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Payment not successful',
          paymentStatus: paymentData.status,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
  } catch (error: any) {
    console.error('Error in verify-paystack-payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});