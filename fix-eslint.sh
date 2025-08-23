#!/bin/bash

# Remove unused imports from page.tsx
sed -i 's/import React, { useEffect }/import React/' src/app/page.tsx
sed -i '/SectionDivider/d' src/app/page.tsx
sed -i '/Card,/d' src/app/page.tsx
sed -i '/CardContent,/d' src/app/page.tsx
sed -i '/CardDescription,/d' src/app/page.tsx
sed -i '/CardHeader,/d' src/app/page.tsx
sed -i '/CardTitle,/d' src/app/page.tsx
sed -i '/Button.*ui\/button/d' src/app/page.tsx
sed -i '/ArrowRight/d' src/app/page.tsx
sed -i '/Badge.*ui\/badge/d' src/app/page.tsx
sed -i '/Link.*next\/link/d' src/app/page.tsx
sed -i '/AnimatePresence, motion/d' src/app/page.tsx
sed -i '/Avatar, AvatarFallback, AvatarImage/d' src/app/page.tsx
sed -i '/EventCardSkeleton/d' src/app/page.tsx
sed -i '/EventCard/d' src/app/page.tsx
sed -i '/Image.*next\/image/d' src/app/page.tsx
sed -i '/Event.*@prisma\/client/d' src/app/page.tsx

# Remove unused variables
sed -i '/const currentStory/d' src/app/page.tsx
sed -i '/const navigateToLogin/d' src/app/page.tsx
sed -i '/const navigateToRegister/d' src/app/page.tsx
sed -i '/const howItWorks/d' src/app/page.tsx

echo "Fixed page.tsx"
