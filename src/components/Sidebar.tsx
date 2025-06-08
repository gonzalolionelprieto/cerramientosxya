
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  Package,
  Calendar,
  Truck,
  Users,
  FileText,
  Settings,
  Building2,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Home,
  Plus,
  List,
  Factory, // Add Factory icon
  Boxes, // Add Boxes icon for Productos
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Pedidos',
    icon: Package,
    children: [
      { name: 'Nuevo Pedido', href: '/pedidos/nuevo', icon: Plus },
      { name: 'Lista de Pedidos', href: '/pedidos', icon: List },
    ],
  },
  {
    name: 'Instalaciones',
    href: '/instalaciones',
    icon: Calendar,
  },
  {
    name: 'Logística',
    href: '/logistica',
    icon: Truck,
  },
  {
    name: 'Proveedores',
    href: '/proveedores',
    icon: Building2,
  },
  {
    name: 'Reportes',
    href: '/reportes',
    icon: BarChart3,
  },
  {
    name: 'Panel Instalador',
    href: '/instalador',
    icon: Users,
  },
  {
    name: 'Configuración',
    href: '/configuracion',
    icon: Settings,
  },
  { // Add new navigation item for Fabrica
    name: 'Fábrica',
    href: '/fabrica',
    icon: Factory,
  },
  {
    name: 'Productos',
    href: '/productos',
    icon: Boxes,
  },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    if (!collapsed) {
      setExpandedItem(null);
    }
  };

  const toggleExpanded = (itemName: string) => {
    if (collapsed) return;
    setExpandedItem(expandedItem === itemName ? null : itemName);
  };

  return (
    <div className={cn(
      "relative flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Home className="w-6 h-6 text-primary-600" />
            <span className="font-bold text-lg text-gray-900">Cerramientos XyA</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapsed}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.href ? location.pathname === item.href : false;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItem === item.name;
            const hasActiveChild = hasChildren && item.children?.some(child => location.pathname === child.href);

            if (hasChildren) {
              return (
                <div key={item.name}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-10",
                      (hasActiveChild || isExpanded) && "bg-primary-50 text-primary-700",
                      collapsed && "justify-center px-2"
                    )}
                    onClick={() => toggleExpanded(item.name)}
                  >
                    <Icon className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.name}</span>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 transition-transform",
                            isExpanded && "rotate-90"
                          )}
                        />
                      </>
                    )}
                  </Button>
                  
                  {!collapsed && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children?.map((child) => {
                        const ChildIcon = child.icon;
                        const isChildActive = location.pathname === child.href;
                        
                        return (
                          <Link key={child.name} to={child.href}>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start h-9 text-sm",
                                isChildActive && "bg-primary-100 text-primary-800"
                              )}
                            >
                              <ChildIcon className="h-3 w-3 mr-3" />
                              {child.name}
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link key={item.name} to={item.href!}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full h-10",
                    collapsed ? "justify-center px-2" : "justify-start",
                    isActive && "bg-primary-100 text-primary-800"
                  )}
                >
                  <Icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                  {!collapsed && <span>{item.name}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            © 2024 Cerramientos XyA
            <br />
            Sistema de Gestión v1.0
          </div>
        </div>
      )}
    </div>
  );
}
