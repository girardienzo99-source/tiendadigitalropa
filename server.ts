import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy load Gemini AI Client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// API Routes FIRST
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!process.env.GEMINI_API_KEY });
});

// Marketing Copywriter & Ad Profile Creator Endpoint
app.post("/api/marketing/generate-copy", async (req, res) => {
  const { promptType, productName, category, objective, discount, additionalInfo } = req.body;

  try {
    const ai = getAiClient();
    if (!ai) {
      return res.status(200).json({
        success: false,
        error: "GEMINI_API_KEY_MISSING",
        message: "No se detectó una clave de API de Gemini válida en los secretos de la aplicación. Se utilizará la generación automatizada local de alta conversión."
      });
    }

    if (promptType === "broadcast") {
      const prompt = `Escribe un mensaje de difusión de WhatsApp altamente persuasivo, amigable y vendedor para una campaña de marketing de nuestra tienda textil y de calzado "CALZADO & TEXTIL".
Detalles de la Campaña:
- Objetivo de la campaña: ${objective || "Descuento Relámpago"}
- Producto/Categoría a promocionar: ${productName || category || "Todo el Catálogo de Moda"}
- Descuento o Beneficio: ${discount ? `${discount}% de Descuento` : "Promoción especial con Envío Gratis"}
- Información adicional/público: ${additionalInfo || "Estilo urbano moderno"}

Estructura requerida del mensaje de WhatsApp:
1. Gancho inicial cautivador con emojis dinámicos de zapatillas y ropa.
2. Presentación de la oferta usando negritas (ej: *ESTO ES PARA VOS*).
3. Detalle de los productos estrella o beneficios.
4. Llamada a la acción clara animando al cliente a responder directamente para reservar su talle o recibir el link de compra.
5. Recordatorio de que aceptamos Mercado Pago y enviamos a todo el país.
Mantén un tono de marca premium, fresco e informal, pero profesional y sumamente persuasivo.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      return res.json({
        success: true,
        text: response.text
      });
    } else if (promptType === "ad_profile") {
      const prompt = `Crea un perfil publicitario y estrategia de marketing digital completa para nuestra tienda de ropa y calzado en base a:
- Producto/Categoría: ${productName || category || "Ropa & Zapatillas"}
- Objetivo: ${objective || "Aumento de ventas"}
- Notas adicionales: ${additionalInfo || "Estilo streetwear urbano moderno"}

Por favor, formatea la respuesta en un informe estructurado y estético con las siguientes secciones en español:
1. 🎯 SEGMENTACIÓN Y PÚBLICO OBJETIVO: Define la edad, intereses de moda, comportamiento de compra y hábitos digitales de la audiencia ideal.
2. 💡 ESTRATEGIA DE COMUNICACIÓN: Los 3 mensajes de venta clave que captarán la atención inmediata del público objetivo.
3. 📸 GUION PARA INSTAGRAM / TIKTOK STORY: Una propuesta creativa de anuncio en video corto de 15 segundos con:
   - Segundo 0-3: El Gancho visual y auditivo
   - Segundo 3-12: El problema/beneficio del calzado/prenda
   - Segundo 12-15: Llamado a la acción (Swipe up / Escribir al WhatsApp)
4. 📈 RECOMENDACIÓN DE PRESUPUESTO & CANALES: Sugerencias prácticas para pauta en redes y optimización de ROI.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      return res.json({
        success: true,
        text: response.text
      });
    } else if (promptType === "broader_angles") {
      const prompt = `Crea un portafolio de 4 ÁNGULOS PUBLICITARIOS ALTAMENTE PERSUASIVOS y creativos para nuestra tienda de moda "${productName || "nuestros productos textiles y calzado"}".
Información de la Campaña:
- Categoría o Producto: ${productName || category || "Todo el Catálogo"}
- Objetivo principal: ${objective || "Captación de nuevos clientes"}
- Descuento / Incentivo: ${discount ? `${discount}% de Descuento` : "Promoción con Envío Bonificado"}
- Detalles/Estilo: ${additionalInfo || "Moda casual urbana"}

Escribe de manera sumamente vendedora, utilizando emojis estratégicos y formatos listos para copiar y usar en redes sociales, anuncios pagados o WhatsApp. Estructura el informe exactamente así:

🔥 ÁNGULO 1: FÓRMULA A.I.D.A. (Atención, Interés, Deseo, Acción)
- Ideal para anuncios fríos de Instagram/Facebook.
- Enfócate en captar la atención de inmediato y guiar al usuario hacia la compra.

💡 ÁNGULO 2: FÓRMULA P.A.S. (Problema, Agitación, Solución)
- Enfócate en el dolor del cliente (calzado incómodo, ropa que pierde color, no saber qué talle elegir o encontrar prendas urbanas con buen calce) y cómo nuestra calidad resuelve ese problema.

✨ ÁNGULO 3: GANCHO DE ESTILO DE VIDA (Lifestyle & Status)
- Genera deseo apelando a la estética, el estilo urbano, sentirse seguro de sí mismo y vestir las últimas tendencias de moda.

🎬 ÁNGULO 4: GUION COMPACTO PARA TIKTOK / REELS (Formato Viral)
- Estructura paso a paso para video corto (15 segundos):
  * [0-3s] GANCHO EXTREMO: Qué decir y mostrar para que no hagan scroll.
  * [3-12s] CUERPO / DEMOSTRACIÓN: Resalta detalles premium de las prendas o zapas.
  * [12-15s] LLAMADO A LA ACCIÓN (CTA): Instrucciones claras para escribir al WhatsApp o comprar.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      return res.json({
        success: true,
        text: response.text
      });
    } else {
      return res.status(400).json({ success: false, error: "INVALID_PROMPT_TYPE" });
    }
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: error.message || "Error al conectar con los servidores de inteligencia artificial."
    });
  }
});

// Vite Middleware or Production Asset Delivery Setup
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FULL-STACK SERVER] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

start();
