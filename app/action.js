"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { scrapeProduct } from "@/utils/scrapeProduct";

export async function signOut(){
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/');
    redirect('/');
}


export async function addProduct(formData){
    const url = formData.get('url');

    if(!url){
        throw new Error("Product URL is required");
    }

    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        
        if(!user){
            return {error: "User not authenticated"};
        }

        const productData = await scrapeProduct(url);

        if(!productData.productName || !productData.currentPrice){
            console.log(productData, "productData");
            
            return {error: "Failed to extract product data"};
        }

        const newPrice = parseFloat(productData.currentPrice);
        const currency = productData.currencyCode || 'USD';

        const {data:existingProduct} = await supabase
            .from('products')
            .select('*')
            .eq('url', url)
            .eq('user_id', user.id)
            .single();

            const isUpdate = !!existingProduct;

            const {data: product,error} = await supabase
            .from('product')
            .upsert({
                user_id: user.id,
                url: url,
                name: productData.productName,
                current_price: newPrice,
                currency: currency,
                image_url: productData.productImageUrl,
                updated_at: new Date().toISOString(),
            },{
                onConflict: "user_id,url",
                ignoreDuplicates: false,
            })
            .select()
            .single();

            if(error){
                throw error;
            }

            const shouldaddHistory = !isUpdate || existingProduct.current_price !== newPrice;

            if(shouldaddHistory){
               await supabase
                .from('price_history')
                .insert({
                    product_id: product.id,
                    price: newPrice,
                    currency: currency,
                });
            }

            revalidatePath("/");
            return{
                success: true,
                product,
                message: isUpdate ? "Product updated successfully" : "Product added successfully",
            }
    } catch (error) {
         console.error("Add product error:", error);
         return {error: error.message};
    }
}

export async function deleteProduct(formData){
    try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("product")
      .delete()
      .eq("id", productId);

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getProducts() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("product")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Get products error:", error);
    return [];
  }
}

export async function getPriceHistory(productId) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("price_history")
      .select("*")
      .eq("product_id", productId)
      .order("checked_at", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Get price history error:", error);
    return [];
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/");
}