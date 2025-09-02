'use server';

import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import prisma from '@/lib/db';

export async function uploadProfilePicture(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return redirect('/login');
  }

  const file = formData.get('profilePicture') as File;
  if (!file) {
    return { error: 'No file selected' };
  }

  const storageRef = ref(storage, `profile-pictures/${session.userId}/${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  await prisma.user.update({
    where: { id: session.userId },
    data: { imageUrl: downloadURL },
  });

  return { success: true, imageUrl: downloadURL };
}
