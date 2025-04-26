'use client';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import type React from 'react';
import { useState } from 'react';
import type { FilterPreset } from './AdvancedFilters';

export interface FilterPresetsProps {
  presets: FilterPreset[];
  onSavePreset: (preset: Omit<FilterPreset, 'id'>) => void;
  onLoadPreset: (presetId: string) => void;
  onDeletePreset: (presetId: string) => void;
  className?: string;
}

export const FilterPresets: React.FC<FilterPresetsProps> = ({
  presets,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
  className = '',
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newPresetName, setNewPresetName] = useState('');
  const [editingPreset, setEditingPreset] = useState<FilterPreset | null>(null);

  const handleSavePreset = () => {
    if (newPresetName.trim()) {
      onSavePreset({
        name: newPresetName.trim(),
        filters: editingPreset?.filters || {},
      });
      setNewPresetName('');
      setEditingPreset(null);
      onClose();
    }
  };

  const handleEditPreset = (preset: FilterPreset) => {
    setEditingPreset(preset);
    setNewPresetName(preset.name);
    onOpen();
  };

  const handleDeletePreset = (presetId: string) => {
    if (window.confirm('Are you sure you want to delete this preset?')) {
      onDeletePreset(presetId);
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Saved Filter Presets</h3>
        <Button
          size="sm"
          color="primary"
          variant="flat"
          onClick={() => {
            setEditingPreset(null);
            setNewPresetName('');
            onOpen();
          }}
        >
          Create New Preset
        </Button>
      </div>

      {presets.length === 0 ? (
        <Card className="bg-default-50">
          <CardBody className="text-center py-8">
            <Icon icon="mdi:filter-variant" className="text-4xl text-default-400 mb-2" />
            <p className="text-default-500">No saved presets yet</p>
            <p className="text-sm text-default-400">
              Create a preset to save your filter combinations
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {presets.map((preset) => (
            <Card key={preset.id} className="bg-default-50">
              <CardHeader className="flex justify-between items-center">
                <h4 className="font-medium">{preset.name}</h4>
                <Dropdown>
                  <DropdownTrigger>
                    <Button size="sm" variant="light" isIconOnly>
                      <Icon icon="mdi:dots-vertical" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Preset actions">
                    <DropdownItem key="load" onClick={() => onLoadPreset(preset.id)}>
                      <Icon icon="mdi:play" className="mr-2" />
                      Load
                    </DropdownItem>
                    <DropdownItem key="edit" onClick={() => handleEditPreset(preset)}>
                      <Icon icon="mdi:pencil" className="mr-2" />
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      onClick={() => handleDeletePreset(preset.id)}
                    >
                      <Icon icon="mdi:delete" className="mr-2" />
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(preset.filters).map(([key, value]) => {
                    if (!value || (Array.isArray(value) && value.length === 0)) return null;
                    return (
                      <span key={key} className="text-sm text-default-500">
                        {key}: {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    );
                  })}
                </div>
              </CardBody>
              <CardFooter>
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  onClick={() => onLoadPreset(preset.id)}
                  className="w-full"
                >
                  Load Preset
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{editingPreset ? 'Edit Preset' : 'Create New Preset'}</ModalHeader>
          <ModalBody>
            <Input
              label="Preset Name"
              placeholder="Enter a name for your preset"
              value={newPresetName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPresetName(e.target.value)
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleSavePreset} isDisabled={!newPresetName.trim()}>
              {editingPreset ? 'Save Changes' : 'Create Preset'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
