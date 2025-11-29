import React, { ReactNode } from 'react';
import { Text } from 'react-native';

export const parseBoldText = (text: string): (string | ReactNode)[] => {
  const parts: (string | React.ReactNode)[] = [];
  const regex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before bold
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add bold text
    parts.push(
      <Text key={match.index} style={{ fontWeight: 'bold' }}>
        {match[1]}
      </Text>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};
