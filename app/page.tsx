import prisma from "./db";
import { revalidatePath } from "next/cache";
import "tailwindcss/tailwind.css";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from '@mui/icons-material/AddRounded';

async function getData() {
  const data = await prisma.todo.findMany({
    select: {
      input: true,
      id: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export default async function Home() {
  const data = await getData();
  async function create(formData: FormData) {
    "use server";

    const input = formData.get("input") as string;

    await prisma.todo.create({
      data: {
        input: input,
      },
    });

    revalidatePath("/");
  }

  async function edit(formData: FormData) {
    "use server";

    const input = formData.get("input") as string;
    const inputId = formData.get("inputId") as string;

    await prisma.todo.update({
      where: {
        id: inputId,
      },
      data: {
        input: input,
      },
    });

    revalidatePath("/");
  }

  async function deleteItem(formData: FormData) {
    "use server";

    const inputId = formData.get("inputId") as string;

    await prisma.todo.delete({
      where: {
        id: inputId,
      },
    });

    revalidatePath("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md ">
        <form className="flex flex-col mb-4" action={create}>
          <label
            htmlFor="input"
            className="text-gray-800 mb-2 flex justify-center text-xl font-semibold"
          >
            New Todo:
          </label>
          <input
            type="text"
            id="input"
            name="input"
            className="border p-2 border-gray-800"
          />
           <button
            className="mt-4 flex items-center justify-center gap-1 bg-cyan-500 rounded-lg text-white py-2 hover:bg-cyan-600 transition duration-300"
            type="submit"
          >
            <span>Add Todo</span>
            <span>
              <AddRoundedIcon />
            </span>
          </button>
        </form>

        <div className="flex flex-col gap-y-2">
          {data.map((todo) => (
            <form
              key={todo.id}
              className="flex items-center bg-gray-200 p-2 rounded-lg"
              action={edit}
            >
              <input type="hidden" name="inputId" value={todo.id} />
              <input
                type="text"
                name="input"
                defaultValue={todo.input}
                className="border p-2 flex-grow rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />

              <button
                title="Edit"
                type="submit"
                className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition duration-300 "
              >
                <EditRoundedIcon fontSize="small" />
              </button>
              <button
                title="Delete"
                formAction={deleteItem}
                className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition duration-300"
              >
                <DeleteRoundedIcon fontSize="small" />
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}