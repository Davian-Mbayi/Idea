import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY env secret key");
    }

    const { productName, sku, quantity, minQuantity, userEmail } = await req.json();

    if (!userEmail) {
      throw new Error("Missing userEmail parameter");
    }

    // Build Resend request
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ShopStock <onboarding@resend.dev>",
        to: [userEmail],
        subject: `⚠️ Alerte Stock Bas : ${productName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #ca8a04; margin: 0;">⚠️ Alerte de Stock Bas</h2>
              <p style="color: #64748b; margin-top: 5px; font-size: 14px;">ShopStock Inventory System</p>
            </div>
            
            <div style="margin-bottom: 25px; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 15px 0;">
              <table style="width: 100%; font-size: 14px;">
                <tr>
                  <td style="color: #64748b; padding-bottom: 8px; font-weight: bold; width: 140px;">Produit :</td>
                  <td style="color: #1e293b; padding-bottom: 8px;">${productName}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; padding-bottom: 8px; font-weight: bold;">SKU / Code :</td>
                  <td style="color: #1e293b; padding-bottom: 8px;"><code>${sku}</code></td>
                </tr>
                <tr>
                  <td style="color: #64748b; padding-bottom: 8px; font-weight: bold;">Quantité restante :</td>
                  <td style="color: #ef4444; padding-bottom: 8px; font-weight: bold; font-size: 16px;">${quantity}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: bold;">Seuil critique :</td>
                  <td style="color: #64748b;">${minQuantity}</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
              Veuillez réapprovisionner cet article auprès de votre fournisseur dès que possible afin d'éviter toute rupture de stock.
            </p>
            
            <div style="text-align: center; margin-top: 30px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px;">
              Généré automatiquement par l'application ShopStock.
            </div>
          </div>
        `,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(result)}`);
    }

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
