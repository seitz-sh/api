/* eslint-disable react-hooks/exhaustive-deps */
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  MantineProviderProps,
  MantineThemeOverride,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { getCookie, setCookie } from "cookies-next";
import { AppContext } from "next/app";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";

declare global {
  interface AppInitialPageProps {
    mantine: MantineInitialProps & {
      colorScheme: ColorScheme;
    };
  }
}

type WithMantineProps = Omit<MantineProviderProps, "children"> & {
  colorScheme?: ColorScheme;
  /** Cookie used to store the user's preferred color scheme */
  cookie?: string;
};

type MantineInitialProps = {
  savedColorScheme?: ColorScheme;
};

export function withMantine(App: (props: any) => JSX.Element, options: WithMantineProps) {
  const { colorScheme: forcedColorScheme, cookie = "color-scheme", ...providerProps } = options;

  function Provider(props: any) {
    // console.log('mantine provider', props);

    const colorProps = useDynamicColorScheme(props?.pageProps?.mantine, {
      forcedColorScheme,
      cookie,
    });

    // @ts-ignore
    const theme = useMemo<MantineThemeOverride>(() => {
      if (providerProps.theme && typeof providerProps.theme === "function") {
        return (...args: any) => {
          return {
            ...(providerProps as any).theme(...args),
            colorScheme: colorProps.colorScheme,
          };
        };
      }
      return {
        ...(providerProps.theme || {}),
        colorScheme: colorProps.colorScheme,
      };
    }, [colorProps.colorScheme, providerProps.theme]);

    return (
      <ColorSchemeProvider {...colorProps}>
        <MantineProvider {...providerProps} theme={theme}>
          <App {...props} />
        </MantineProvider>
      </ColorSchemeProvider>
    );
  }

  async function getInitialProps(ctx: AppContext) {
    const inherited = "getInitialProps" in App ? await (App as any).getInitialProps(ctx) : {};

    const savedCookie = getCookie(cookie, ctx.ctx);
    const mantine: MantineInitialProps = {
      savedColorScheme: savedCookie as any,
    };

    return {
      ...inherited,
      pageProps: {
        ...(inherited?.pageProps || {}),
        mantine,
      },
    };
  }

  return Object.assign(Provider, {
    getInitialProps,
  });
}

function useDynamicColorScheme(
  props: MantineInitialProps,
  config: {
    forcedColorScheme?: ColorScheme;
    cookie: string;
  },
) {
  const { savedColorScheme } = props || {};
  const { forcedColorScheme, cookie } = config;

  const [colorScheme, setColorScheme] = useState<ColorScheme>(forcedColorScheme || savedColorScheme || "light");

  const toggleColorScheme = useCallback(
    (value?: ColorScheme) => {
      const nextColorScheme = value || (colorScheme === "dark" ? "light" : "dark");
      setCookie(cookie, nextColorScheme);
      setColorScheme(nextColorScheme);
    },
    [colorScheme],
  );

  const devicePreference: ColorScheme = useMediaQuery("(prefers-color-scheme: dark)") ? "dark" : "light";
  const desiredColorScheme = useMemo<ColorScheme>(() => {
    const desired = getCookie(cookie);
    if (desired === "dark") return "dark";
    if (desired === "light") return "light";
    return devicePreference || "light";
  }, [devicePreference]);

  const [isThemeSet, setIsThemeSet] = useState(savedColorScheme !== undefined);
  useEffect(() => {
    if (isThemeSet) return;
    if (forcedColorScheme) return;
    if (savedColorScheme !== undefined) return;
    if (colorScheme == desiredColorScheme) return;
    setIsThemeSet(true);
    toggleColorScheme(desiredColorScheme);
  }, [colorScheme, desiredColorScheme]);

  if (props) {
    // @ts-ignore
    props.colorScheme = colorScheme;
  }

  // console.log({ colorScheme, savedColorScheme })

  return {
    colorScheme,
    toggleColorScheme,
  };
}

/** Shorthand for `check ? value : undefined`
 * - Used frequently when the JSX default value is desired unless a specific condition is met.
 * - Avoids frequent retyping of `: undefined` in dozens of conditionals in JSX properties.
 * ```tsx
 * <Element padding={isMobile ? 20 : undefined} color={darkMode ? 'red' : undefined} />
 * <Element padding={onlyif(isMobile, 20)} color={onlyIf(darkmode, 'red')} />
 * ```
 */
export function onlyIf<T>(check: boolean, value: T) {
  if (check) return value;
  return undefined;
}

export function usePageSize() {
  const [height, setHeight] = useState(1000);
  const [width, setWidth] = useState(1000);
  const state = useMemo(() => ({ height, width }), [height, width]);
  if (typeof window !== "undefined") {
    // eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps
    useLayoutEffect(() => {
      const body = document.querySelector("body");
      if (body) {
        setHeight(body?.clientHeight);
        setWidth(body?.clientWidth);
      }
    });
  }
  return state;
}

type Child = JSX.Element; //React.ReactElement<any, any>;

export function useClientHydration() {
  const [hydrated, setHydrated] = useState(typeof window !== "undefined" && "isHydrated" in window);
  useEffect(() => {
    if (!hydrated && typeof window !== "undefined") {
      setHydrated(true);
      setTimeout(() => {
        // @ts-ignore
        window.isHydrated = true;
      }, 100);
    }
  });
  return hydrated;
}

export function NoSSR({ children, loader = <></> }: { children: Child; loader?: Child }): Child {
  const show = useClientHydration();
  return show ? children : loader;
}