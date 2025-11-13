import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Icon from "@/components/ui/icon";
import { Card } from "@/components/ui/card";

type Document = {
  id: number;
  title: string;
  type: string;
  author: string;
  lastModified: string;
  version: string;
  status: "draft" | "review" | "approved";
};

const mockDocuments: Document[] = [
  {
    id: 1,
    title: "Протокол испытаний оборудования №45",
    type: "Протокол",
    author: "Иванов А.С.",
    lastModified: "2024-11-10 14:32",
    version: "3.2",
    status: "approved",
  },
  {
    id: 2,
    title: "Методика калибровки измерительных приборов",
    type: "Методика",
    author: "Петрова М.В.",
    lastModified: "2024-11-09 11:15",
    version: "2.1",
    status: "review",
  },
  {
    id: 3,
    title: "Отчет о результатах исследований",
    type: "Отчет",
    author: "Сидоров В.П.",
    lastModified: "2024-11-08 16:45",
    version: "1.0",
    status: "draft",
  },
  {
    id: 4,
    title: "Техническое задание на разработку",
    type: "ТЗ",
    author: "Иванов А.С.",
    lastModified: "2024-11-07 09:20",
    version: "4.0",
    status: "approved",
  },
  {
    id: 5,
    title: "Инструкция по эксплуатации лабораторного оборудования",
    type: "Инструкция",
    author: "Козлова Е.А.",
    lastModified: "2024-11-06 13:50",
    version: "1.5",
    status: "approved",
  },
];

const mockNotifications = [
  { id: 1, text: "Новая версия документа «Протокол №45»", time: "5 мин назад" },
  { id: 2, text: "Доступ к документу изменен", time: "1 час назад" },
  { id: 3, text: "Документ отправлен на согласование", time: "2 часа назад" },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "review":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "draft":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Утвержден";
      case "review":
        return "На проверке";
      case "draft":
        return "Черновик";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <Icon name="FileText" className="text-primary-foreground" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">DocLab</h1>
                  <p className="text-xs text-muted-foreground">Система управления документами</p>
                </div>
              </div>

              <nav className="hidden md:flex items-center gap-1">
                <Button
                  variant={activeTab === "all" ? "secondary" : "ghost"}
                  onClick={() => setActiveTab("all")}
                  className="gap-2"
                >
                  <Icon name="FolderOpen" size={16} />
                  Все документы
                </Button>
                <Button
                  variant={activeTab === "my" ? "secondary" : "ghost"}
                  onClick={() => setActiveTab("my")}
                  className="gap-2"
                >
                  <Icon name="User" size={16} />
                  Мои документы
                </Button>
                <Button
                  variant={activeTab === "projects" ? "secondary" : "ghost"}
                  onClick={() => setActiveTab("projects")}
                  className="gap-2"
                >
                  <Icon name="Briefcase" size={16} />
                  Проекты
                </Button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden lg:block">
                <Icon
                  name="Search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  placeholder="Поиск документов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Icon name="Bell" size={20} />
                    {mockNotifications.length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Уведомления</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {mockNotifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start py-3">
                      <p className="text-sm">{notification.text}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>АИ</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">А. Иванов</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Мой профиль</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Icon name="User" size={16} className="mr-2" />
                    Настройки профиля
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icon name="Settings" size={16} className="mr-2" />
                    Настройки системы
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Выход
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Icon name="Filter" size={18} />
                Фильтры
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Тип документа</label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все типы</SelectItem>
                      <SelectItem value="Протокол">Протокол</SelectItem>
                      <SelectItem value="Методика">Методика</SelectItem>
                      <SelectItem value="Отчет">Отчет</SelectItem>
                      <SelectItem value="ТЗ">ТЗ</SelectItem>
                      <SelectItem value="Инструкция">Инструкция</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Сортировка</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">По дате изменения</SelectItem>
                      <SelectItem value="name">По названию</SelectItem>
                      <SelectItem value="author">По автору</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Button className="w-full gap-2" size="lg">
              <Icon name="Plus" size={20} />
              Добавить документ
            </Button>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Список документов</h2>
                <p className="text-muted-foreground mt-1">
                  Найдено документов: {filteredDocuments.length}
                </p>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Автор</TableHead>
                    <TableHead>Последнее изменение</TableHead>
                    <TableHead>Версия</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">
                        <button className="text-left hover:text-primary transition-colors">
                          {doc.title}
                        </button>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.type}</Badge>
                      </TableCell>
                      <TableCell>{doc.author}</TableCell>
                      <TableCell className="text-muted-foreground">{doc.lastModified}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{doc.version}</code>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(doc.status)}>
                          {getStatusText(doc.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Icon name="Download" size={16} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Icon name="Edit" size={16} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Icon name="History" size={16} />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Icon name="MoreVertical" size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Icon name="Share2" size={16} className="mr-2" />
                                Поделиться
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Icon name="Copy" size={16} className="mr-2" />
                                Дублировать
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Icon name="Trash2" size={16} className="mr-2" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Показано 1-{filteredDocuments.length} из {filteredDocuments.length}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" disabled>
                  <Icon name="ChevronLeft" size={16} />
                </Button>
                <Button variant="outline" size="sm">
                  1
                </Button>
                <Button variant="outline" size="icon" disabled>
                  <Icon name="ChevronRight" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
