import Sidebar from "@/components/dashboard/Sidebar";

type SidebarWrapperProps = {
  activeItem: string;
  onItemClick: (item: string) => void;
};

export default function SidebarWrapper({
  activeItem,
  onItemClick,
}: SidebarWrapperProps) {
  return (
    <Sidebar
      activeItem={activeItem}
      onItemClick={onItemClick}
    />
  );
}