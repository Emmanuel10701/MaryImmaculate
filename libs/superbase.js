import { createClient } from '@supabase/supabase-js';

// --- INITIALIZATION ---

const cleanEnv = (value) => {
  if (!value) return '';
  return value.toString().replace(/^["']|["']$/g, '').trim();
};

const supabaseUrl = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseKey = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

// --- FILE MANAGER CLASS ---

const BUCKET_NAME = 'Katwanyaa High';

export class FileManager {
  /**
   * Upload file to Supabase (Events, News, Student Builds, etc.)
   */
  static async uploadFile(file, folder = 'uploads') {
    if (!file || file.size === 0) return null;

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${folder}/${timestamp}-${sanitizedName}`;

      console.log(`📤 Uploading to [${BUCKET_NAME}]:`, fileName);

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, buffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw new Error(`Upload failed: ${error.message}`);

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      console.log('✅ Upload Successful:', publicUrl);

      return {
        url: publicUrl,
        key: data.path,
        fileName: file.name,
        fileType: file.type,
        fileSize: buffer.length,
        storageType: 'supabase'
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  /**
   * Extract file key from Supabase URL (Supports various URL formats)
   */
  static extractFileKey(fileUrl) {
    if (!fileUrl) return null;
    try {
      const cleanUrl = fileUrl.split('?')[0];
      const patterns = [
        /storage\/v1\/object\/public\/Katwanyaa(?:%20| )High\/(.+)/
      ];

      for (const pattern of patterns) {
        const match = cleanUrl.match(pattern);
        if (match?.[1]) return decodeURIComponent(match[1]);
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Delete single or multiple files
   */
  static async deleteFiles(fileUrls) {
    const urls = Array.isArray(fileUrls) ? fileUrls : [fileUrls];
    if (!urls.length) return { success: true };

    try {
      const keys = urls
        .map(url => this.extractFileKey(url))
        .filter(Boolean);

      if (!keys.length) return { success: true };

      const { error } = await supabase.storage.from(BUCKET_NAME).remove(keys);
      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update file (Deletes old, uploads new)
   */
  static async updateFile(oldFileUrl, newFile, folder) {
    if (oldFileUrl) await this.deleteFiles(oldFileUrl);
    return newFile?.size > 0 ? this.uploadFile(newFile, folder) : null;
  }
}