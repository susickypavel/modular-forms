import { makeEventListener } from '@solid-primitives/event-listener';
import { isClient } from '@solid-primitives/utils';
import clsx from 'clsx';
import { createSignal, For, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { A, useLocation, useParams } from 'solid-start';
import { Framework, frameworks, useFramework } from '~/contexts';
import { AngleDownIcon, QwikIcon, SolidIcon } from '~/icons';

type FrameworkPickerProps = {
  class?: string;
};

/**
 * Allows the user to navigate between frameworks.
 */
export function FrameworkPicker(props: FrameworkPickerProps) {
  // Use params and framework
  const params = useParams();
  const [, setFramework] = useFramework();

  // Create open and element signal
  const [getOpen, setOpen] = createSignal(false);
  const [getElement, setElement] = createSignal<HTMLDivElement>();

  // Close picker when clicked outside
  if (isClient) {
    makeEventListener(document, 'click', (event) => {
      if (getOpen() && !getElement()!.contains(event.target as Node)) {
        setOpen(false);
      }
    });
  }

  /**
   * Returns the name of the framework.
   */
  const getName = (framework: string) =>
    framework === 'solid' ? 'SolidJS' : 'Qwik';

  /**
   * Returns the icon of the framework.
   */
  const getIcon = (framework: string) =>
    framework === 'solid' ? SolidIcon : QwikIcon;

  /**
   * Returns the pathname to the framework.
   */
  const getPathname = (framework: string) => {
    const pathList = useLocation().pathname.split('/');
    pathList[1] = framework;
    return pathList.join('/');
  };

  return (
    <div class={clsx('relative', props.class)} ref={setElement}>
      <button
        class="flex h-12 w-full items-center justify-between rounded-xl border-2 border-slate-200 px-3.5 hover:border-slate-300 focus:border-sky-600/50 dark:border-slate-800 dark:hover:border-slate-700 dark:focus:border-sky-400/50"
        type="button"
        onClick={() => setOpen((open) => !open)}
      >
        <div class="flex">
          <Show
            when={frameworks.includes(params.framework as Framework)}
            fallback="Framework..."
          >
            <Dynamic class="mr-2.5 h-6" component={getIcon(params.framework)} />
            <div class="text-slate-900 dark:text-slate-200">
              {getName(params.framework)}
            </div>
          </Show>
        </div>
        <AngleDownIcon class="h-5" />
      </button>
      <nav
        class={clsx(
          'absolute z-10 w-full origin-top rounded-xl border-2 border-slate-200 bg-white/90 backdrop-blur duration-200 hover:border-slate-300 dark:border-slate-800 dark:bg-gray-900/90 dark:hover:border-slate-700',
          getOpen() ? 'translate-y-2' : 'invisible scale-y-75 opacity-0'
        )}
        aria-hidden={!getOpen()}
      >
        <For
          each={frameworks.filter(
            (framework) => framework !== params.framework
          )}
        >
          {(framework) => (
            <A
              class="flex space-x-2.5 px-3.5 py-3 hover:text-slate-900 dark:hover:text-slate-200"
              href={getPathname(framework)}
              onClick={() => {
                setOpen(false);
                setFramework(framework);
              }}
            >
              <Dynamic class="mr-2.5 h-6" component={getIcon(framework)} />
              {getName(framework)}
            </A>
          )}
        </For>
      </nav>
    </div>
  );
}