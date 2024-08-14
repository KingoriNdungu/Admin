import Image from "next/image";
import Blog from "./Blog";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col  justify-between p-6">

      <Blog />
    </main>
  );
}
