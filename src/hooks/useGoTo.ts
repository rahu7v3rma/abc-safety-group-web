import { useRouter } from 'next/navigation';

export default function useGoTo<K extends string>(map: Record<K, string>) {
   const router = useRouter();
   return (key: K) => router.push(map[key]);
}
