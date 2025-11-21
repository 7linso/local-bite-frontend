import { ref, watch, unref, type Ref, type WatchSource } from "vue";

export const useDebounce = <T>(source: WatchSource<T>, delay = 400): Ref<T> => {
  const debounced = ref<T>(unref(source)) as Ref<T>;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  watch(
    source,
    (value) => {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        debounced.value = value;
      }, delay);
    },
    { immediate: true }
  );

  return debounced;
};
