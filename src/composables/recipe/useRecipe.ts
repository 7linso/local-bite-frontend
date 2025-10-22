import type { RecipePayload } from "@/lib/types"
import { reactive, ref } from "vue"

export const useRecipe = (

) => {
    const form = reactive<RecipePayload>({
        title: '',
        description: '',
        ingredients: [{
            ingredient: '',
            amount: 0,
            measure: ''
        }],
        instructions: [],
        dishTypes: [],
        recipePic: '',
        location: {
            locality: '',
            area: '',
            country: ''
        }
    })

    const loading = ref<boolean>(false)

    let errors = reactive<Record<string, string>>({})

    const onCreateRecipe = () => {

    }

    return { loading, errors, form, onCreateRecipe }
}