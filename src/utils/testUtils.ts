export const calculateAccuracy = (originalText: string, typedText: string): number => {
  console.log("Calculating accuracy for:", { originalText, typedText });
  
  if (!typedText || !originalText) return 0;
  
  const minLength = Math.min(originalText.length, typedText.length);
  let correctChars = 0;
  
  for (let i = 0; i < minLength; i++) {
    if (originalText[i] === typedText[i]) {
      correctChars++;
    }
  }
  
  return (correctChars / originalText.length) * 100;
};