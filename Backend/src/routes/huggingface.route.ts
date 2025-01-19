// filepath: /d:/CollabSphere/Backend/src/utils/huggingface.ts
import axios from 'axios';
import { Router } from "express";
const router = Router()

const API_KEY = process.env.HUGGINGFACE_API_KEY;

router.route("/generate").post( async (req,res) => {
  const { prompt } = req.body;
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/google/gemma-2-2b-it',
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 50,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
      }
    );
    return response.data.generated_text;
  } catch (error) {
    const err = error as any;
    console.error('Error fetching AI completion:', err.response?.data || err.message);
    return 'Error: Unable to fetch AI completion. Please try again later.';
  }
});

export default router;
