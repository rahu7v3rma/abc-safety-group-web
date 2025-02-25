import { useRouter } from 'next/navigation';

export default function useUpdateSearchParams() {
   const router = useRouter();

   return (key: string, value: string) => {
      const url = new URL(window.location.href);
      url.searchParams.set(key, value);

      router.push(url.toString());
      router.refresh();
   };
}
