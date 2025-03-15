"use client";
import { Providers } from '@/app/context/Providers';
import { ThemeSwitch } from '@/components/common/ThemeSwitch';
import { GithubIcon } from '@/components/icons/Icons';
import HomeFooter from "@/components/layout/HomeFooter";
import HomeHeader from "@/components/layout/HomeHeader";
import SidebarWrapper from "@/components/sidebar/SidebarWrapper";
import { siteConfig } from '@/config/site';
import { Button, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import type React from "react";
import { useState } from "react";

export default function HomeLayout({
	children,
}: { children: React.ReactNode }) {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const onToggle = () => {
		setIsCollapsed((prev) => !prev);
	};

	return (
		<div className="flex h-screen w-full">
			{/* ✅ SidebarWrapper receives isCollapsed & onToggle */}
			<SidebarWrapper isCollapsed={isCollapsed} onToggle={onToggle} />

			{/* ✅ Main Content Area */}
			<div className="flex-1 flex flex-col p-4">
              {/* ✅ HEADER - Navigation & Actions */}
        <header className="flex items-center rounded-medium border-small border-divider p-2 h-18 min-h-1">
        {/* ✅ Collapse Button (Left) */}
          <div className="flex items-center">
            <Button isIconOnly size="sm" variant="light" onPress={onToggle}>
              <Icon
                className="text-default-500"
                height={24}
                icon="solar:sidebar-minimalistic-outline"
                width={24}
              />
            </Button>
          </div>

          {/* ✅ Search Bar (Center) */}
          <div className="flex flex-1 justify-center item-center">
            <HomeHeader onOpen={() => console.log('HomeHeader opened')} />
          </div>

          {/* ✅ GitHub & Theme Switch (Right) */}
          <div className="flex items-center gap-2">
            <Button isIconOnly radius="full" variant="light" aria-label="GitHub">
              <Link isExternal aria-label="Github" href={siteConfig.links.github}>
                <GithubIcon className="text-default-500" width={20} />
              </Link>
            </Button>
            <ThemeSwitch aria-label="Toggle theme" />
          </div>
      </header>

				{/* ✅ MAIN CONTENT */}
         <Providers>
				<main className="flex-1 mt-4 w-full overflow-hidden">{children}</main>
        </Providers>
				{/* ✅ FOOTER - Copyright & Links */}
				<HomeFooter />
			</div>
		</div>
	);
}
