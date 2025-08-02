
export const getBooksData = async(code:string)=>
        {
            const apiKey = import.meta.env.VITE_GOOGLEAPI;
            const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${code}&key=${apiKey}`;
           try {
                    const response = await fetch(url);
                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error("API GOOGLE ERROR", error);
                    return null;
                }

        };
        
