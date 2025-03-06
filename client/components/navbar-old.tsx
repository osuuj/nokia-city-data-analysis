// import { Input } from '@heroui/input';
// import { Kbd } from '@heroui/kbd';
// import { Link } from '@heroui/link';
// import {
//   Navbar as HeroUINavbar,
//   NavbarBrand,
//   NavbarContent,
//   NavbarItem,
//   NavbarMenu,
//   NavbarMenuItem,
//   NavbarMenuToggle,
// } from '@heroui/navbar';
// import { link as linkStyles } from '@heroui/theme';
// import clsx from 'clsx';
// import NextLink from 'next/link';

// import { GithubIcon, Logo, SearchIcon } from '@/components/icons';
// import { ThemeSwitch } from '@/components/theme-switch';
// import { siteConfig } from '@/config/site';

// export const Navbar = () => {
//   const searchInput = (
//     <Input
//       aria-label="Search"
//       classNames={{
//         inputWrapper: 'bg-default-100',
//         input: 'text-sm',
//       }}
//       endContent={
//         <Kbd className="hidden lg:inline-block" keys={['command']}>
//           K
//         </Kbd>
//       }
//       labelPlacement="outside"
//       placeholder="Search..."
//       startContent={
//         <SearchIcon className="pointer-events-none flex-shrink-0 text-base text-default-400" />
//       }
//       type="search"
//     />
//   );

//   return (
//     <HeroUINavbar maxWidth="xl" position="sticky">
//       <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
//         <NavbarBrand as="li" className="max-w-fit gap-3">
//           <NextLink className="flex items-center justify-start gap-1" href="/">
//             <Logo />
//             <p className="font-bold text-inherit">Company Search</p>
//           </NextLink>
//         </NavbarBrand>
//         <ul className="ml-2 hidden justify-start gap-4 lg:flex">
//           {siteConfig.navItems.map((item) => (
//             <NavbarItem key={item.href}>
//               <NextLink
//                 className={clsx(
//                   linkStyles({ color: 'foreground' }),
//                   'data-[active=true]:font-medium data-[active=true]:text-primary'
//                 )}
//                 color="foreground"
//                 href={item.href}
//               >
//                 {item.label}
//               </NextLink>
//             </NavbarItem>
//           ))}
//         </ul>
//       </NavbarContent>

//       <NavbarContent
//         className="hidden basis-1/5 sm:flex sm:basis-full"
//         justify="center"
//       >
//         <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
//         <NavbarItem className="hidden gap-2 sm:flex">
//           <Link isExternal aria-label="Github" href={siteConfig.links.github}>
//             <GithubIcon className="text-default-500" />
//           </Link>
//           <ThemeSwitch />
//         </NavbarItem>
//       </NavbarContent>

//       <NavbarContent className="basis-1 pl-4 sm:hidden" justify="end">
//         <Link isExternal aria-label="Github" href={siteConfig.links.github}>
//           <GithubIcon className="text-default-500" />
//         </Link>
//         <ThemeSwitch />
//         <NavbarMenuToggle />
//       </NavbarContent>

//       <NavbarMenu>
//         {searchInput}
//         <div className="mx-4 mt-2 flex flex-col gap-2">
//           {siteConfig.navMenuItems.map((item, index) => (
//             <NavbarMenuItem key={`${item}-${index}`}>
//               <Link
//                 color={
//                   index === 2
//                     ? 'primary'
//                     : index === siteConfig.navMenuItems.length - 1
//                       ? 'danger'
//                       : 'foreground'
//                 }
//                 href="#"
//                 size="lg"
//               >
//                 {item.label}
//               </Link>
//             </NavbarMenuItem>
//           ))}
//         </div>
//       </NavbarMenu>
//     </HeroUINavbar>
//   );
// };
