import React from "react";
import { Button } from "@/components/ui/button";

type Props = {
  isLoading?: boolean;
  onClose: () => void;
};

const TotalesYAccionesButtons: React.FC<Props> = ({ isLoading, onClose }) => {
  return (
    <div className="flex gap-4 pt-4">
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Guardando...' : 'Guardar'}
      </Button>
      <Button type="button" variant="outline" onClick={onClose}>
        Cancelar
      </Button>
    </div>
  );
};

export default TotalesYAccionesButtons;