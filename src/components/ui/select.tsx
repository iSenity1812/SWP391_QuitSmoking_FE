/**
 * ====================================================================
 * SELECT COMPONENT - Simple select component using dropdown menu
 * ====================================================================
 */

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectValueProps {
  placeholder?: string;
}

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}>({});

export const Select: React.FC<SelectProps> = ({ 
  value, 
  onValueChange, 
  placeholder, 
  children,
  className 
}) => {
  return (
    <SelectContext.Provider value={{ value, onValueChange, placeholder }}>
      <DropdownMenu>
        {children}
      </DropdownMenu>
    </SelectContext.Provider>
  );
};

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, className }) => {
  return (
    <DropdownMenuTrigger asChild>
      <Button 
        variant="outline" 
        className={`justify-between ${className || ''}`}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>
    </DropdownMenuTrigger>
  );
};

export const SelectContent: React.FC<SelectContentProps> = ({ children }) => {
  return (
    <DropdownMenuContent className="w-56">
      {children}
    </DropdownMenuContent>
  );
};

export const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  const { onValueChange } = React.useContext(SelectContext);
  
  return (
    <DropdownMenuItem onClick={() => onValueChange?.(value)}>
      {children}
    </DropdownMenuItem>
  );
};

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  const { value, placeholder: contextPlaceholder } = React.useContext(SelectContext);
  
  return (
    <span>
      {value || placeholder || contextPlaceholder || 'Chọn...'}
    </span>
  );
};
