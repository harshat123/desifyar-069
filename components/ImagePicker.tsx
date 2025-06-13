import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Image as RNImage } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { Upload, X, FileImage, AlertCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

interface ImagePickerProps {
  imageUri: string | null;
  onImageSelected: (uri: string) => void;
  onImageRemoved: () => void;
}

export default function CustomImagePicker({ imageUri, onImageSelected, onImageRemoved }: ImagePickerProps) {
  const [error, setError] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<{
    size?: number;
    width?: number;
    height?: number;
    type?: string;
  } | null>(null);

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setError(null);
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        allowsMultipleSelection: false,
        exif: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        // Check file size (limit to 5MB)
        if (selectedImage.fileSize && selectedImage.fileSize > 5 * 1024 * 1024) {
          setError("Image size exceeds 5MB limit. Please choose a smaller image.");
          return;
        }
        
        // Set image info
        setImageInfo({
          size: selectedImage.fileSize,
          width: selectedImage.width,
          height: selectedImage.height,
          type: selectedImage.type || getFileExtension(selectedImage.uri),
        });
        
        onImageSelected(selectedImage.uri);
      }
    } catch (err) {
      console.error("Error picking image:", err);
      setError("Failed to select image. Please try again.");
    }
  };
  
  const getFileExtension = (uri: string): string => {
    const parts = uri.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'Unknown';
  };
  
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size';
    
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  const handleRemoveImage = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setImageInfo(null);
    setError(null);
    onImageRemoved();
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Flyer Image</Text>
      
      {imageUri ? (
        <View style={styles.imagePreviewContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.imagePreview}
            contentFit="cover"
          />
          
          {imageInfo && (
            <View style={styles.imageInfoContainer}>
              <Text style={styles.imageInfoText}>
                {imageInfo.width}×{imageInfo.height} • {formatFileSize(imageInfo.size)} • {imageInfo.type}
              </Text>
            </View>
          )}
          
          <TouchableOpacity
            style={styles.removeImageButton}
            onPress={handleRemoveImage}
          >
            <X size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <FileImage size={32} color={colors.textSecondary} />
          <Text style={styles.imagePickerTitle}>Upload Flyer Image</Text>
          <Text style={styles.imagePickerText}>
            JPG, PNG, HEIC, WEBP • Max 5MB • Recommended 16:9
          </Text>
        </TouchableOpacity>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={16} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <Text style={styles.helperText}>
        High-quality images attract more customers. Use clear, well-lit photos of your store, products, or event.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  imagePicker: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    height: 200,
  },
  imagePickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  imagePickerText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    height: 200,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imageInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
  },
  imageInfoText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginLeft: 6,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
});