export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ObjectDefinition {
    id: string;
    name: string;
    description?: string;
    schema: Record<string, any>;
    icon?: string;
    color?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate?: string;
    allDay: boolean;
    data: Record<string, any>;
    userId: string;
    objectDefinitionId: string;
    objectDefinition?: ObjectDefinition;
    createdAt: string;
    updatedAt: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto extends LoginDto {
    firstName?: string;
    lastName?: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}
