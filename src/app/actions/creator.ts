
'use server';

import { z } from 'zod';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

async function getAuthenticatedUser() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { creatorProfile: true }
  });

  if (!user || user.role !== 'CREATOR' || !user.creatorProfile) {
    // This case should ideally not happen if middleware and signup are correct
    redirect('/login');
  }

  return { userId: user.id, profileId: user.creatorProfile.id };
}


// Zod Schema for profile validation
const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  bio: z.string().max(500, { message: "Bio must be less than 500 characters." }).optional(),
  skills: z.string().min(1, {message: "Please enter at least one skill."}),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});


export async function updateCreatorProfile(prevState: any, formData: FormData) {
  const { userId, profileId } = await getAuthenticatedUser();

  const rawData = {
    name: formData.get('name'),
    bio: formData.get('bio'),
    skills: formData.get('skills'),
    website: formData.get('website'),
  };

  const validatedFields = profileSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update profile. Please check your inputs.',
      success: false,
    };
  }
  
  const { name, bio, skills, website } = validatedFields.data;

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { name },
      }),
      prisma.creatorProfile.update({
        where: { id: profileId },
        data: {
          bio,
          skills: skills.split(',').map(s => s.trim()),
          website,
        },
      }),
    ]);
    
    revalidatePath('/dashboard/creator/profile');
    return { success: true, message: 'Profile updated successfully!', errors: {} };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to update profile.', errors: {} };
  }
}

const portfolioSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  file: z.instanceof(File).refine(file => file.size > 0, "File is required"),
})

export async function addPortfolioItem(prevState: any, formData: FormData) {
    const { profileId } = await getAuthenticatedUser();
    
    // For file uploads, we need to handle them carefully.
    // This is a simplified version. In production, you'd upload to a service like S3.
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    // Basic validation
    if (!file || file.size === 0 || !title) {
        return { success: false, message: "File and title are required."}
    }
    
    // In a real app, you would upload the file to a cloud storage (S3, GCS, etc.)
    // and get a URL back. For now, we'll just create a placeholder path.
    // Ensure you create the `public/uploads/videos` directory.
    const uploadPath = `/uploads/videos/${Date.now()}_${file.name}`;
    
    // This part is tricky as server actions don't have direct access to the file system
    // in the same way a traditional server would to save the file. 
    // We'll save the path and assume the file is handled by a separate process or a Vercel Blob-like service.
    
    try {
        await prisma.portfolioItem.create({
            data: {
                creatorProfileId: profileId,
                title,
                description,
                type: file.type.startsWith('video') ? 'VIDEO' : 'IMAGE',
                url: uploadPath,
            }
        });

        revalidatePath('/dashboard/creator/profile');
        return { success: true, message: 'Portfolio item added!' };
    } catch (error) {
        console.error(error)
        return { success: false, message: 'Failed to add portfolio item.'}
    }
}

const submissionSchema = z.object({
    briefId: z.string().min(1),
    message: z.string().optional(),
    file: z.instanceof(File).refine(file => file.size > 0, "A file is required for submission."),
});

export async function createSubmission(prevState: any, formData: FormData) {
    const { userId } = await getAuthenticatedUser();

    const validatedFields = submissionSchema.safeParse({
        briefId: formData.get('briefId'),
        message: formData.get('message'),
        file: formData.get('file'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'There was an error with your submission.',
            success: false
        };
    }
    
    const { briefId, message, file } = validatedFields.data;

    // Again, simulating file upload
    const uploadPath = `/uploads/submissions/${Date.now()}_${file.name}`;

    try {
        await prisma.submission.create({
            data: {
                briefId: parseInt(briefId),
                creatorId: userId,
                message,
                fileUrl: uploadPath,
                status: 'PENDING'
            }
        });
        revalidatePath(`/dashboard/creator/opportunities/${briefId}`);
        return { success: true, message: "Your work has been submitted!", errors: {} };

    } catch (error) {
        console.error("Submission error:", error);
        return { success: false, message: "There was an error submitting your work.", errors: {} };
    }
}
