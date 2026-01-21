export class CreateOrderItemDto {
    menu_item_id: string;
    quantity: number;
}

export class CreateOrderDto {
    table_number: string;
    branch_id: string;
    items: CreateOrderItemDto[];
}

