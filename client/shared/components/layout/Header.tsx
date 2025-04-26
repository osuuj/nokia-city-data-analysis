import { Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { ThemeSwitcher } from '../ui/theme';

export const Header = () => {
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() || 0;
    setHidden(latest > previous && latest > 100);
    setAtTop(latest <= 20);
  });

  const headerVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: -25 },
  };

  return (
    <motion.header
      variants={headerVariants}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ ease: 'easeInOut', duration: 0.3 }}
      className={`fixed top-0 w-full z-50 ${
        atTop ? 'pt-6' : 'pt-2 backdrop-blur-md bg-background/70 shadow-sm'
      }`}
    >
      <Navbar
        shouldHideOnScroll={false}
        className={`max-w-7xl mx-auto transition-all duration-300 ${
          atTop ? 'bg-transparent' : 'bg-transparent'
        }`}
        classNames={{
          wrapper: 'px-4 sm:px-6',
        }}
      >
        <NavbarBrand>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="#home" className="font-bold text-inherit text-xl">
              <span className="text-primary">K</span>assu
            </Link>
          </motion.div>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="#about" className="text-sm font-medium">
              About
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#experience" className="text-sm font-medium">
              Experience
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#skills" className="text-sm font-medium">
              Skills
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#projects" className="text-sm font-medium">
              Projects
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#testimonials" className="text-sm font-medium">
              Testimonials
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <ThemeSwitcher />
          </NavbarItem>
          <NavbarItem>
            <Button
              as={Link}
              href="#contact"
              color="primary"
              variant="flat"
              endContent={<Icon icon="lucide:arrow-right" />}
              size="sm"
            >
              Let's Talk
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </motion.header>
  );
};
