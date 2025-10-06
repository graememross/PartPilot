"use client";

import {
  Burger,
  Button,
  Center,
  Container,
  Group,
  Menu,
  Image,
  Box,
  Drawer,
  ScrollArea,
  Divider,
  rem,
  Stack,
} from "@mantine/core";
import classes from "./NavHeader.module.css";
import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import onScan from "onscan.js";
import { useDisclosure } from "@mantine/hooks";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import Link from "next/link";
import { ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";

type NavLink = {
  link: string;
  label: string;
  links?: { link: string; label: string }[];
  isHiddenInDesktop?: boolean
}

const links: Array<NavLink> = [
  { link: "/", label: "Dashboard" },
  { link: "/categories", label: "Categories" },
  { link: "/project", label: "Projects"},
  { link: "/warehouse", label: "Warehouses"},
  { link: "/store", label: "Stores"}
  // { link: "/about", label: "About Us" },
];

const mobileLinks: Array<NavLink> = [
  { link: "/login", label: "Log In", isHiddenInDesktop: true },
  { link: "/signup", label: "Sign Up", isHiddenInDesktop: true }
]

export default function NavHeader() {
  const session = useSession()
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const items = (navLinks: Array<NavLink>): Array<ReactNode> => {
    return navLinks.map((link) => {
      const menuItems = link.links?.map((item) => (
        <Menu.Item key={item.link}>{item.label}</Menu.Item>
      ));

      if (menuItems) {
        return (
          <Menu
            key={link.label}
            trigger="hover"
            transitionProps={{ exitDuration: 0 }}
            withinPortal
          >
            <Menu.Target>
              <Link
                href={link.link}
                className={classes.link}
                onClick={(event) => event.preventDefault()}
              >
                <Center>
                  <span className={classes.linkLabel}>{link.label}</span>
                  <IconChevronDown size="0.9rem" stroke={1.5} />
                </Center>
              </Link>
            </Menu.Target>
            <Menu.Dropdown>{menuItems}</Menu.Dropdown>
          </Menu>
        );
      }

      return (
        <Link
          key={link.label}
          href={link.link}
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            if (link.link === "/") {
              if (pathname !== link.link) {
                router.push(link.link);
              } else {
                window.location.href = "/";
              }
            } else {
              if (pathname !== link.link) {
                if (
                  typeof document !== "undefined" &&
                  typeof onScan !== "undefined"
                ) {
                  if (onScan.isAttachedTo(document)) {
                    onScan.detachFrom(document);
                  }
                }
              }
              router.push(link.link);
            }
            closeDrawer();
          }}
        >
          {link.label}
        </Link>
      );
    })
  };

  return (
    <Box>
      <header className={classes.header}>
        <Container fluid p={"sm"} h={60}>
          <Group className={classes.inner}>
            <Image
              src="/images/PartPilot-Logo.png"
              alt="Logo"
              h={40}
              fit="contain"
              w="auto"
              onClick={() => {
                router.push("/");
              }}
              style={{ cursor: "pointer" }}
            />
            <Group gap={5} visibleFrom="sm">
              {items(links)}
            </Group>
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              hiddenFrom="sm"
              c={"gray"}
            />
            <Group visibleFrom="sm" className={classes.actions}>
              <Button
                rightSection={<IconPlus />}
                onClick={() => {
                  if (
                    typeof document !== "undefined" &&
                    typeof onScan !== "undefined"
                  ) {
                    if (onScan.isAttachedTo(document)) {
                      onScan.detachFrom(document);
                    }
                  }
                  router.push("/add");
                }}
              >
                Add Part
              </Button>
              <UserAvatar />
            </Group>
          </Group>
        </Container>
      </header>
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="70%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my={"sm"} />
          <Stack>
            {items(links)}
            {session.data?.user?.email ? (
              <Link href='/' className={classes.link} onClick={() => signOut()}>Log Out</Link>
            ) : (
              items(mobileLinks)
            )}
          </Stack>
          <Divider my={"sm"} />
          <Group justify="center" grow pb="xl" px="md">
            <Button
              rightSection={<IconPlus />}
              onClick={() => {
                if (
                  typeof document !== "undefined" &&
                  typeof onScan !== "undefined"
                ) {
                  if (onScan.isAttachedTo(document)) {
                    onScan.detachFrom(document);
                  }
                }
                router.push("/add");
              }}
            >
              Add Part
            </Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box >
  );
}
