import { Blob } from "buffer";
import { promisify } from "util";
const sleep = promisify(setTimeout);

const FACEPP_API_URL = "https://api-us.faceplusplus.com/facepp/v3";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function makeRequest(formData: FormData, retryCount = 0): Promise<number> {
  try {
    const response = await fetch(`${FACEPP_API_URL}/detect`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const error = await response.text();
      if (error.includes("CONCURRENCY_LIMIT_EXCEEDED") && retryCount < MAX_RETRIES) {
        await sleep(RETRY_DELAY * (retryCount + 1));
        return makeRequest(formData, retryCount + 1);
      }
      throw new Error(`Face++ API error: ${error}`);
    }

    const data = await response.json();

    if (!data.faces?.[0]?.attributes?.beauty) {
      throw new Error("No face detected in the image");
    }

    // Face++ returns male and female scores, we'll use the average
    const beauty = data.faces[0].attributes.beauty;
    return (beauty.male_score + beauty.female_score) / 2;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await sleep(RETRY_DELAY * (retryCount + 1));
      return makeRequest(formData, retryCount + 1);
    }
    throw error;
  }
}

export async function analyzeFace(photoBase64: string): Promise<number> {
  const formData = new FormData();

  // Convert base64 to blob
  const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, 'base64');
  const blob = new Blob([buffer]);

  formData.append("api_key", process.env.FACEPP_API_KEY!);
  formData.append("api_secret", process.env.FACEPP_API_SECRET!);
  formData.append("image_file", blob);
  formData.append("return_attributes", "beauty");

  return makeRequest(formData);
}