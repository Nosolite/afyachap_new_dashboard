import { items } from './config';

const hasRole = (entry, role) => Boolean(entry?.roles?.includes(role));

export const getVisibleNavItems = (role) => {
  return items.reduce((visible, item) => {
    if (item.children) {
      const children = item.children.filter((child) => hasRole(child, role));
      if (children.length > 0 || hasRole(item, role)) {
        visible.push({ ...item, children, entryPath: children[0]?.path ?? item.path });
      }
    } else if (hasRole(item, role)) {
      visible.push({ ...item, entryPath: item.path });
    }
    return visible;
  }, []);
};

const matchesPath = (path, pathname) => path === pathname;

const startsWithPath = (path, pathname) => path !== '/' && pathname.startsWith(`${path}/`);

export const findActiveNav = (navItems, pathname) => {
  for (const matcher of [matchesPath, startsWithPath]) {
    for (const item of navItems) {
      const child = item.children?.find((entry) => matcher(entry.path, pathname));
      if (child) {
        return { section: item, child };
      }
      if (!item.children?.length && matcher(item.path, pathname)) {
        return { section: item, child: null };
      }
    }
  }
  return { section: null, child: null };
};
