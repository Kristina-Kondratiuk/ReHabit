import * as FileSystem from 'expo-file-system/legacy';

const FRONT_CAMERA_PHOTO_PREFIX = 'rehabit-front-camera-photo:';
const PROFILE_PHOTO_FOLDER = 'profile-photos';

export const markFrontCameraPhoto = (uri: string) => {
  return `${FRONT_CAMERA_PHOTO_PREFIX}${encodeURIComponent(uri)}`;
};

export const getDisplayPhotoUri = (uri: string) => {
  if (!uri.startsWith(FRONT_CAMERA_PHOTO_PREFIX)) {
    return uri;
  }

  return decodeURIComponent(uri.slice(FRONT_CAMERA_PHOTO_PREFIX.length));
};

export const shouldUnmirrorPhoto = (uri: string | null | undefined) => {
  return Boolean(uri?.startsWith(FRONT_CAMERA_PHOTO_PREFIX));
};

const getProfilePhotoDirectory = () => {
  if (!FileSystem.documentDirectory) {
    throw new Error('Document directory is not available');
  }

  return `${FileSystem.documentDirectory}${PROFILE_PHOTO_FOLDER}/`;
};

const getFileExtension = (uri: string) => {
  const cleanUri = uri.split(/[?#]/)[0];
  const filename = cleanUri.split('/').pop() ?? '';
  const extension = filename.split('.').pop();

  if (!extension || extension === filename || extension.length > 5) {
    return 'jpg';
  }

  return extension.toLowerCase();
};

export const saveProfilePhotoToDevice = async (uri: string, options?: { frontCamera?: boolean }) => {
  const shouldKeepUnmirrored = options?.frontCamera || shouldUnmirrorPhoto(uri);
  const sourceUri = getDisplayPhotoUri(uri);
  const directory = getProfilePhotoDirectory();

  if (sourceUri.startsWith(directory)) {
    return shouldKeepUnmirrored ? markFrontCameraPhoto(sourceUri) : sourceUri;
  }

  const directoryInfo = await FileSystem.getInfoAsync(directory);

  if (!directoryInfo.exists) {
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  }

  const extension = getFileExtension(sourceUri);
  const destination = `${directory}profile-${Date.now()}.${extension}`;

  await FileSystem.copyAsync({
    from: sourceUri,
    to: destination,
  });

  return shouldKeepUnmirrored ? markFrontCameraPhoto(destination) : destination;
};
