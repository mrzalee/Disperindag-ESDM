declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';
  
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  }
  
  export type LucideIcon = ComponentType<LucideProps>;
  
  export const FileText: LucideIcon;
  export const Search: LucideIcon;
  export const Eye: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Download: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Edit: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const XCircle: LucideIcon;
  export const Clock: LucideIcon;
  export const MessageCircle: LucideIcon;
  export const Plus: LucideIcon;
  export const Trash2: LucideIcon;
  export const Users: LucideIcon;
  export const Scale: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const Calendar: LucideIcon;
  export const Activity: LucideIcon;
  export const PieChart: LucideIcon;
  export const BarChart3: LucideIcon;
  export const Globe: LucideIcon;
  export const MapPin: LucideIcon;
  export const Upload: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const History: LucideIcon;
}