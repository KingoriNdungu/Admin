import dynamic from 'next/dynamic'

// Dynamically import the Blog component with no SSR
const DynamicBlog = dynamic(() => import('./Blog'), {
  ssr: false,
  loading: () => <p>Loading...</p>,  // Optional: shows a loading message while the component loads
  // You can also handle errors here if necessary
})

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between p-6">
      <DynamicBlog />  {/* Render the dynamically imported Blog component */}
    </main>
  );
}
