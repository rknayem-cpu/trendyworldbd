import Hero from '@/components/Hero'
import Category from '@/components/Category'
import Products from '@/components/Products'
export default function Page(){

  return(
<>

<div className="w-full h-auto">
<Hero/>
<Category/>
<Products/>
</div>

</>
  )
}