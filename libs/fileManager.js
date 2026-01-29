import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

class FileManager {
  constructor() {
    this.bucketName = 'school-documents';
    this.initializeBucket();
  }

  // ==================== INITIALIZE BUCKET ====================
  async initializeBucket() {
    try {
      // Check if bucket exists
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) throw error;
      
      const bucketExists = buckets.some(bucket => bucket.name === this.bucketName);
      
      if (!bucketExists) {
        console.log(`📦 Creating bucket: ${this.bucketName}`);
        
        // Create bucket if it doesn't exist
        const { data, error: createError } = await supabase.storage.createBucket(this.bucketName, {
          public: true,
          allowedMimeTypes: [
            'image/*',
            'video/*',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain'
          ],
          fileSizeLimit: 100 * 1024 * 1024 // 100MB
        });
        
        if (createError) {
          console.warn('Could not create bucket:', createError.message);
        } else {
          console.log(`✅ Bucket created: ${this.bucketName}`);
        }
      } else {
        console.log(`✅ Bucket exists: ${this.bucketName}`);
      }
    } catch (error) {
      console.warn('Bucket initialization error:', error.message);
    }
  }

  // ==================== ENSURE BUCKET EXISTS ====================
  async ensureBucketExists() {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets.some(bucket => bucket.name === this.bucketName);
      
      if (!bucketExists) {
        console.log(`⚠️ Bucket ${this.bucketName} not found. Attempting to create...`);
        await this.initializeBucket();
      }
      
      return true;
    } catch (error) {
      console.error('Failed to ensure bucket exists:', error);
      return false;
    }
  }

  // ==================== FILE UPLOAD METHODS ====================
  async uploadFile(file, folder, metadata = {}) {
    try {
      // Ensure bucket exists first
      const bucketReady = await this.ensureBucketExists();
      if (!bucketReady) {
        throw new Error(`Bucket ${this.bucketName} is not available`);
      }

      if (!file || !(file instanceof File)) {
        throw new Error('Invalid file provided');
      }

      const timestamp = Date.now();
      const uniqueId = Math.random().toString(36).substring(7);
      const safeFileName = file.name
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9._-]/g, '');
      
      const filePath = `${folder}/${timestamp}_${uniqueId}_${safeFileName}`;
      
      const fileMetadata = {
        // File information
        original_name: file.name,
        file_type: file.type,
        file_size: file.size,
        mime_type: file.type,
        file_extension: file.name.split('.').pop().toLowerCase(),
        
        // Upload information
        uploaded_at: new Date().toISOString(),
        uploaded_by: 'school_portal',
        
        // System information
        system: {
          uploaded_via: 'school_portal',
          client_timestamp: Date.now(),
          processing_status: 'complete'
        },
        
        // Custom metadata
        ...metadata
      };
      
      console.log(`📤 Uploading ${file.name} to ${filePath}...`);
      
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
          metadata: fileMetadata
        });
      
      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);
      
      console.log(`✅ File uploaded successfully: ${urlData.publicUrl}`);
      
      return {
        success: true,
        url: urlData.publicUrl,
        path: filePath,
        name: file.name,
        size: file.size,
        type: file.type,
        metadata: fileMetadata
      };
      
    } catch (error) {
      console.error('❌ Upload failed:', error);
      throw error;
    }
  }

  // ==================== SIMPLIFIED UPLOAD (for quick testing) ====================
  async simpleUpload(file, folder) {
    try {
      // First, let's test if bucket exists
      console.log('Testing bucket access...');
      
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Cannot list buckets:', listError);
        throw new Error(`Cannot access storage: ${listError.message}`);
      }
      
      console.log('Available buckets:', buckets);
      
      const bucketExists = buckets.some(bucket => bucket.name === this.bucketName);
      
      if (!bucketExists) {
        // Try to create bucket
        console.log(`Creating bucket: ${this.bucketName}`);
        const { data, error: createError } = await supabase.storage.createBucket(this.bucketName, {
          public: true
        });
        
        if (createError) {
          console.error('Failed to create bucket:', createError);
          throw new Error(`Please create bucket "${this.bucketName}" in Supabase Storage first.`);
        }
      }
      
      // Now upload the file
      const timestamp = Date.now();
      const uniqueId = Math.random().toString(36).substring(7);
      const safeFileName = file.name
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9._-]/g, '');
      
      const filePath = `${folder}/${timestamp}_${uniqueId}_${safeFileName}`;
      
      console.log(`Uploading to: ${filePath}`);
      
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);
      
      return {
        success: true,
        url: urlData.publicUrl,
        path: filePath
      };
      
    } catch (error) {
      console.error('Simple upload failed:', error);
      
      // Provide helpful error message
      if (error.message.includes('Bucket not found')) {
        throw new Error(`Storage bucket "${this.bucketName}" not found. Please create it in Supabase Dashboard:
        1. Go to Supabase Dashboard
        2. Click "Storage" in sidebar
        3. Click "Create Bucket"
        4. Name: "school-documents"
        5. Set to Public
        6. Click "Create bucket"`);
      }
      
      throw error;
    }
  }

  // ==================== OTHER METHODS (keep as before) ====================
  async getFileMetadata(filePath) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list('', {
          limit: 1,
          search: filePath.split('/').pop()
        });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        return data[0].metadata || {};
      }
      
      return null;
      
    } catch (error) {
      console.error('❌ Get metadata failed:', error);
      return null;
    }
  }

  async deleteFile(filePath) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);
      
      if (error) throw error;
      
      return {
        success: true,
        message: 'File deleted successfully',
        path: filePath
      };
      
    } catch (error) {
      console.error('❌ Delete failed:', error);
      throw error;
    }
  }

  async getFileUrl(filePath) {
    try {
      const { data } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);
      
      return data.publicUrl;
      
    } catch (error) {
      console.error('❌ Get URL failed:', error);
      return null;
    }
  }
}

// Create and export singleton instance
const fileManager = new FileManager();
export default fileManager;

// Also export the supabase client for direct use if needed
export { supabase };