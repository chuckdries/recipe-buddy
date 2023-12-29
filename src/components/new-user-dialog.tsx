'use client'


import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "~/components/ui/dialog";
import {Button} from "~/components/ui/button";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CreateUser, CreateUserSchema} from "~/server/api/modules/users/procedures/createUserSchema";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import {api} from "~/trpc/react";
import {useState} from "react";
import {toast} from "sonner";

export const NewUserDialog = () => {

  const [open, setOpen] = useState(false)

  const form = useForm<CreateUser>({
    resolver: zodResolver(CreateUserSchema)
  })

  const utils = api.useContext()

  const {mutate, isLoading} = api.users.create.useMutation({
    onMutate: (variables) => {
      const prevData = utils.users.list.getData()
      utils.users.list.setData(undefined, old => old ? [...old, {
        name: variables.name,
        username: variables.username,
        id: 5000
      }] : [{name: variables.name, username: variables.username, id: 5000}])

      return {prevData}

    },
    onError(_err, _newPost, ctx) {
      toast.error("Unable to create user")
      utils.users.list.setData(undefined, ctx?.prevData || []);
    },
    onSettled() {
      setOpen(false)
      utils.users.list.invalidate();
    },
  })


  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button disabled={isLoading}>
            Add User
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add User
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Form  {...form}>
              <form id="addUser" onSubmit={form.handleSubmit(a => mutate(a))}>
                <FormField render={({field, fieldState, formState,}) => (
                    <FormItem>
                      <FormLabel>
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input autoComplete="off" {...field}/>
                      </FormControl>
                      <FormDescription>
                        The user&apos;s full name
                      </FormDescription>
                      <FormMessage/>
                    </FormItem>
                )} name="name" control={form.control}/>
                <FormField render={({field, fieldState, formState,}) => (
                    <FormItem>
                      <FormLabel>
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input autoComplete="off" {...field}/>
                      </FormControl>
                      <FormDescription>
                        The username that will be used to log in
                      </FormDescription>
                      <FormMessage/>
                    </FormItem>
                )} name="username" control={form.control}/>
                <FormField render={({field, fieldState, formState,}) => (
                    <FormItem>
                      <FormLabel>
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input type="password" autoComplete="new-password" {...field}/>
                      </FormControl>
                      <FormDescription>
                        The user&apos;s password
                      </FormDescription>
                      <FormMessage/>
                    </FormItem>
                )} name="password" control={form.control}/>
              </form>
            </Form>
          </DialogBody>
          <DialogFooter>
            <Button disabled={isLoading} type="submit" form="addUser">Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )


}
