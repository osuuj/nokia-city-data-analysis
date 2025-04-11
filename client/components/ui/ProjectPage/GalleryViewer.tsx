'use client';

import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import React from 'react';

interface GalleryViewerProps {
  gallery: string[];
  projectTitle: string;
}

export default function GalleryViewer({ gallery, projectTitle }: GalleryViewerProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const openImageViewer = (image: string) => {
    setSelectedImage(image);
    onOpen();
  };

  if (!gallery?.length) {
    return (
      <Card className="text-center py-12">
        <CardBody>
          <Icon icon="lucide:image-off" className="text-4xl mx-auto mb-4 text-default-400" />
          <p className="text-default-600">No gallery images available for this project.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((image, index) => (
          <motion.div
            key={image}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <Card
              isPressable
              onPress={() => openImageViewer(image)}
              className="overflow-hidden shadow-lg h-64"
            >
              <CardBody className="p-0 overflow-hidden relative">
                <img
                  src={image}
                  alt={`${projectTitle} screenshot ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <Button
                    size="sm"
                    color="default"
                    variant="flat"
                    startContent={<Icon icon="lucide:zoom-in" />}
                    className="backdrop-blur-md bg-background/30"
                  >
                    View Larger
                  </Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        placement="center"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody className="p-0">
              {selectedImage && (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt={`${projectTitle} screenshot`}
                    className="w-full h-auto"
                  />
                  <Button
                    isIconOnly
                    color="default"
                    variant="flat"
                    onPress={onClose}
                    className="absolute top-4 right-4 bg-background/30 backdrop-blur-md"
                  >
                    <Icon icon="lucide:x" />
                  </Button>
                </div>
              )}
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
