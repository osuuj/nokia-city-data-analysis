'use client';

import { useSearch } from '@/components/hooks/search-data';
import { GithubIcon } from '@/components/ui/icons';
import { ThemeSwitch } from '@/components/ui/theme-switch';
import { siteConfig } from '@/config/site';
import { Autocomplete, AutocompleteItem, Button, Link } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function HomeHeader({ onOpen }: { onOpen: () => void }) {
  const { cities, router } = useSearch();

  return (
    <header className="flex h-16 items-center justify-between gap-2">
      <Button isIconOnly className="flex sm:hidden" size="sm" variant="light" onPress={onOpen}>
        <Icon
          className="text-default-500"
          height={24}
          icon="solar:hamburger-menu-outline"
          width={24}
        />
      </Button>
      <div className="flex flex-1 justify-center items-center gap-2">
        <div className="max-w-md w-full">
          <Autocomplete
            className="max-w-xs"
            defaultItems={(cities || []).map((city) => ({ name: city }))}
            label="Search by city"
            variant="underlined"
            onFocus={() => {
              document.querySelector('[data-overlay-container]')?.removeAttribute('aria-hidden'); // ✅ Fix: Ensure input is accessible
            }}
            onSelectionChange={(selected) => {
              if (selected) {
                router.push(`/?city=${selected}`);
              }
            }}
          >
            {(item) => <AutocompleteItem key={item.name}>{item.name}</AutocompleteItem>}
          </Autocomplete>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button isIconOnly radius="full" variant="light" aria-label="GitHub">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" width={24} />
          </Link>
        </Button>
        <ThemeSwitch aria-label="Toggle theme" />
      </div>
    </header>
  );
}
