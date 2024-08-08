const dotenv = require("dotenv")
dotenv.config()
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://smpxgyiogmxexcsfkkuz.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY_QUOTE;
const supabase = createClient(supabaseUrl, supabaseKey);


exports.uploadImage = async (file,folderPath) =>{
    const fileName = `${Date.now()}-${file.fileName}` // Create a unique file name
    const filePath = `${folderPath}/${fileName}` // Combine folder path and file name
    const { data, error } = await supabase
        .storage
        .from('images')
        .upload(filePath, file)

    if (error) {
        console.error('Error uploading file:', error)
        return null
    }

    // Step 4: Return the URL of the uploaded image
    const { publicURL, error: urlError } = supabase
        .storage
        .from('images')
        .getPublicUrl(filePath)

    if (urlError) {
        console.error('Error getting public URL:', urlError)
        return null
    }

    return publicURL
};

