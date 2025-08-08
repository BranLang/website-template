import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderStatus, OrderType } from '../../entities/order.entity';

const orderExample = {
  id: 1,
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '+123456789',
  message: 'I would like a quote for 5 windows.',
  type: OrderType.INQUIRY,
  status: OrderStatus.PENDING,
  adminNotes: null,
  productDetails: { productId: 1, quantity: 5 },
  estimatedPrice: 500,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({
    type: CreateOrderDto,
    examples: {
      default: {
        summary: 'Order request',
        value: {
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '+123456789',
          message: 'I would like a quote for 5 windows.',
          type: OrderType.INQUIRY,
          productDetails: { productId: 1, quantity: 5 },
          estimatedPrice: 500,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    schema: { example: orderExample },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'List of all orders',
    schema: { example: [orderExample] },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('status/:status')
  @ApiOperation({ summary: 'Get orders by status' })
  @ApiParam({ name: 'status', enum: OrderStatus, description: 'Order status' })
  @ApiResponse({
    status: 200,
    description: 'List of orders with a specific status',
    schema: { example: [orderExample] },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByStatus(@Param('status') status: OrderStatus) {
    return this.ordersService.findByStatus(status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('type/:type')
  @ApiOperation({ summary: 'Get orders by type' })
  @ApiParam({ name: 'type', enum: OrderType, description: 'Order type' })
  @ApiResponse({
    status: 200,
    description: 'List of orders of a specific type',
    schema: { example: [orderExample] },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByType(@Param('type') type: OrderType) {
    return this.ordersService.findByType(type);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Order details',
    schema: { example: orderExample },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiBody({
    type: UpdateOrderDto,
    examples: {
      default: {
        summary: 'Update order example',
        value: { status: OrderStatus.CONFIRMED, adminNotes: 'Processed' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
    schema: { example: orderExample },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiBody({
    schema: {
      properties: {
        status: { enum: Object.values(OrderStatus) },
      },
      example: { status: OrderStatus.CONFIRMED },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
    schema: { example: orderExample },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  updateStatus(@Param('id') id: string, @Body() body: { status: OrderStatus }) {
    return this.ordersService.updateStatus(+id, body.status);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Order deleted successfully',
    schema: { example: orderExample },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
