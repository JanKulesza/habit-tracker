"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader } from './ui/card'
import { AvatarImage, AvatarFallback, Avatar } from './ui/avatar'
import { format } from 'date-fns'
import { User } from '@/generated/prisma/client'
import EditProfileBtn from './buttons/edit-profile'

const ProfileCard = ({ user: u }: { user: User }) => {
    const [user, setUser] = useState(u)
    const splittedUserName =user.name.split(" ")
    const userNameFallBack = splittedUserName.length > 1  && splittedUserName[1].length !== 0
    ? splittedUserName[0][0] + splittedUserName[1][0]
    : user.name.slice(0, 2).toUpperCase() 
    return (
        <Card className='py-5'>
            <CardHeader className="font-medium text-lg">
                Profile
            </CardHeader>
            <CardContent className='flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center'>
                <div className="flex gap-4 items-center">
                    <Avatar className="size-18">
                        <AvatarImage
                            src="/"
                            alt="profile image"
                            className="grayscale"
                        />
                        <AvatarFallback className="text-lg text-foreground font-bold">{userNameFallBack}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="font-medium text-lg mb-1">{user.name}</h2>
                        <p className="text-muted-foreground text-sm mb-1">{user.email}</p>
                        <p className="text-muted-foreground">Joined: {format(user.createdAt, "d MMMM yyyy")}</p>
                    </div>
                </div>
                <EditProfileBtn user={user} onResult={(user) => setUser(user)} />
            </CardContent>
        </Card>
    )
}

export default ProfileCard