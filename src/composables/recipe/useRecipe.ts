import type { RecipePayload, Recipe } from "@/lib/types";
import { reactive, ref } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { recipes } from "@/lib/api/recipes";
import { useRouter } from "vue-router";

export const useRecipe = (
  auth: ReturnType<typeof useAuthStore>,
  toast: ReturnType<any>,
  onSaved?: () => void
) => {
  const u = auth.user;
  const router = useRouter();

  const loading = ref(false);
  const errors = reactive<Record<string, string>>({});
  const deleteOpen = ref<boolean>(false);

  // recipe for detail page
  const recipe = ref<Recipe | null>(null);

  // form for creating new
  const form = reactive<RecipePayload>({
    title: "",
    description: "",
    ingredients: [
      {
        ingredient: "",
        amount: 0,
        measure: "",
      },
    ],
    instructions: [""],
    dishTypes: [],
    recipePic: "",
    location: {
      locality: u?.defaultLocation?.locality || "",
      area: u?.defaultLocation?.area || "",
      country: u?.defaultLocation?.country || "",
    },
  });

  const resetErrors = () => {
    for (const k of Object.keys(errors)) delete errors[k];
  };

  // image
  const preview = ref<string | null>(null);

  const handleImageSelect = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Use allowed format: jpeg, png, webp!", { position: "top" });
      target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      preview.value = dataUrl;
      form.recipePic = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // ingredients
  const addIngredientAfter = (i: number) => {
    form.ingredients.splice(i + 1, 0, {
      ingredient: "",
      amount: 0,
      measure: "",
    });
  };

  const removeIngredient = (i: number) => {
    if (form.ingredients.length > 1) {
      form.ingredients.splice(i, 1);
    }
  };

  // instructions
  const addInstructionAfter = (i: number) => {
    form.instructions.splice(i + 1, 0, "");
  };

  const removeInstruction = (i: number) => {
    if (form.instructions.length > 1) {
      form.instructions.splice(i, 1);
    }
  };

  const validate = () => {
    resetErrors();

    const title = form.title.trim();
    if (!title) errors.title = "Title is required.";
    else if (title.length > 100)
      errors.title = "Title should be 100 characters max.";

    if (form.description.trim().length > 500)
      errors.description = "Description should be 500 characters max.";

    if (!Array.isArray(form.ingredients) || form.ingredients.length === 0) {
      errors.ingredients = "At least one ingredient is required.";
    } else {
      let hasIngredientError = false;
      form.ingredients.forEach((ing, i) => {
        const name = (ing.ingredient ?? "").trim();
        if (!name) {
          errors[`ingredients.${i}.ingredient`] =
            "Ingredient name is required.";
          hasIngredientError = true;
        } else if (name.length > 100) {
          errors[`ingredients.${i}.ingredient`] = "Max 100 characters.";
          hasIngredientError = true;
        }

        const measure = (ing.measure ?? "").trim();
        if (measure && measure.length > 20) {
          errors[`ingredients.${i}.measure`] = "Max 20 characters.";
          hasIngredientError = true;
        }
      });
      if (hasIngredientError && !errors.ingredients) {
        errors.ingredients = "Fix the highlighted ingredient fields.";
      }
    }

    if (!Array.isArray(form.instructions) || form.instructions.length === 0) {
      errors.instructions = "At least one instruction is required.";
    } else {
      const nonEmpty = form.instructions.filter(
        (s) => (s ?? "").trim().length > 0
      ).length;
      if (nonEmpty === 0)
        errors.instructions = "At least one instruction is required.";
      form.instructions.forEach((step, i) => {
        const s = (step ?? "").trim();
        if (!s) {
          errors[`instructions.${i}`] = "Instruction cannot be empty.";
        } else if (s.length > 200) {
          errors[`instructions.${i}`] = "Max 200 characters per step.";
        }
      });
    }

    const L = form.location;
    const hasAll =
      (L.locality ?? "").trim() &&
      (L.area ?? "").trim() &&
      (L.country ?? "").trim();

    if (!hasAll) {
      errors.location =
        "All location fields are required (locality, area, country).";
    }

    return Object.keys(errors).length === 0;
  };

  const createRecipe = async () => {
    if (!validate()) {
      toast.error("Check the highlighted fields.", { position: "top" });
      return;
    }

    try {
      const payload: RecipePayload = {
        ...form,
        dishTypes: form.dishTypes,
        location: {
          locality: form.location.locality.trim(),
          area: form.location.area.trim(),
          country: form.location.country.trim(),
        },
        instructions: form.instructions.map((s) => s.trim()),
        ingredients: form.ingredients.map((x) => ({
          ingredient: x.ingredient.trim(),
          amount: x.amount,
          measure: (x.measure ?? "").trim(),
        })),
      };

      await recipes.createRecipe(payload);
      toast.success("Success!", { position: "top" });
      onSaved?.();
      router.replace("/recipes");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ??
        e?.friendlyMessage ??
        e?.data?.message ??
        e?.message ??
        "Failed to add recipe";

      if (msg.toLowerCase().includes("title")) {
        errors.title = msg;
      } else if (msg.startsWith("Description")) {
        errors.description = msg;
      } else if (msg.includes("ingredients")) {
        errors.ingredients = msg;
      } else if (msg.toLowerCase().includes("dish type")) {
        errors.dishTypes = msg;
      } else if (
        msg.startsWith("Missing required location fields") ||
        msg === "Unknown country name." ||
        msg === "Failed to geocode." ||
        msg.toLowerCase().includes("location")
      ) {
        errors.location = msg;
      } else {
        errors.form = msg;
      }
      toast.error(msg, { position: "top" });
    }
  };

  const getRecipe = async (id: string) => {
    console.log("getRecipe called with id:", id);
    try {
      loading.value = true;
      resetErrors();

      const res = await recipes.getRecipe(id);
      console.log("fetched recipe:", res);

      recipe.value = res;

      form.title = res.title;
      form.description = res.description;
      form.ingredients = res.ingredients;
      form.instructions = res.instructions;
      form.dishTypes = res.dishTypes;
      form.recipePic = res.recipePic;
      form.location = {
        locality: res.locationSnapshot.locality,
        area: res.locationSnapshot.area,
        country: res.locationSnapshot.country,
      };

      preview.value = res.recipePic || null;
    } catch (e: any) {
      errors.all = e?.data?.message ?? e.message;
    } finally {
      loading.value = false;
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      await recipes.deleteRecipe(id);
      toast.success("Successfully deleted recipe!", { position: "top" });
      router.push("/recipes");
    } catch (e: any) {
      toast.error("Failed to delete recipe!", { position: "top" });
    }
  };

  const editRecipe = async (id: string) => {
    if (!id) {
      toast.error("Recipe ID is missing.", { position: "top" });
      return;
    }

    if (!validate()) {
      toast.error("Check the highlighted fields.", { position: "top" });
      return;
    }

    try {
      const payload: RecipePayload = {
        ...form,
        dishTypes: form.dishTypes,
        location: {
          locality: form.location.locality.trim(),
          area: form.location.area.trim(),
          country: form.location.country.trim(),
        },
        instructions: form.instructions.map((s) => s.trim()),
        ingredients: form.ingredients.map((x) => ({
          ingredient: x.ingredient.trim(),
          amount: x.amount,
          measure: (x.measure ?? "").trim(),
        })),
      };

      await recipes.editRecipe(payload, id);
      toast.success("Success!", { position: "top" });
      onSaved?.();
      router.replace(`/recipes/${id}`);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ??
        e?.friendlyMessage ??
        e?.data?.message ??
        e?.message ??
        "Failed to add recipe";

      if (msg.toLowerCase().includes("title")) {
        errors.title = msg;
      } else if (msg.startsWith("Description")) {
        errors.description = msg;
      } else if (msg.includes("ingredients")) {
        errors.ingredients = msg;
      } else if (msg.toLowerCase().includes("dish type")) {
        errors.dishTypes = msg;
      } else if (
        msg.startsWith("Missing required location fields") ||
        msg === "Unknown country name." ||
        msg === "Failed to geocode." ||
        msg.toLowerCase().includes("location")
      ) {
        errors.location = msg;
      } else {
        errors.form = msg;
      }
      toast.error(msg, { position: "top" });
    }
  };
  return {
    loading,
    errors,
    form,
    recipe,
    preview,
    handleImageSelect,
    addIngredientAfter,
    removeIngredient,
    addInstructionAfter,
    removeInstruction,
    createRecipe,
    getRecipe,
    validate,
    deleteOpen,
    deleteRecipe,
    editRecipe,
  };
};
