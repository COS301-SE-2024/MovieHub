import { supabase } from '../../../backend/src/supabaseClient.js';

export async function uploadImage(imageFile, folder) {

  const response = await fetch(imageFile);
  const blob = await response.blob();
  const arrayBuffer = await new Response(blob).arrayBuffer();
  const fileName = `${folder}/${Date.now()}.jpg`;
  const { error } = await supabase
    .storage
    .from('images')
    .upload(fileName, arrayBuffer, { contentType: 'image/jpeg', upsert: false });
  
  if (error) {
    console.error('Error uploading image: ', error);
  }
  return getImageUrl(fileName);
};


export function getImageUrl(filePath) {
  const { data, error } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  if (error) {
    console.error('Error getting public URL:', error);
    return null;
  }

  console.log('Public URL:', data.publicUrl);
  return data.publicUrl;
}
