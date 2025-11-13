import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DocumentVersion = {
  version: string;
  date: string;
  author: string;
  changes: string;
};

type Comment = {
  id: number;
  author: string;
  date: string;
  text: string;
  avatar: string;
};

const mockDocument = {
  id: 1,
  title: "Протокол испытаний оборудования №45",
  type: "Протокол",
  author: "Иванов А.С.",
  createdDate: "2024-10-01 09:00",
  lastModified: "2024-11-10 14:32",
  version: "3.2",
  status: "approved",
  description: "Протокол испытаний измерительного оборудования на соответствие требованиям ГОСТ 8.568-2017. Включает результаты калибровки, проверки точности и стабильности показаний.",
  project: "Модернизация лабораторного комплекса",
  fileSize: "2.4 MB",
  fileFormat: "PDF",
  tags: ["испытания", "оборудование", "ГОСТ"],
  permissions: {
    canEdit: true,
    canDelete: false,
    canShare: true,
  },
};

const mockVersions: DocumentVersion[] = [
  {
    version: "3.2",
    date: "2024-11-10 14:32",
    author: "Иванов А.С.",
    changes: "Добавлены результаты повторных испытаний, исправлены опечатки",
  },
  {
    version: "3.1",
    date: "2024-11-05 11:20",
    author: "Иванов А.С.",
    changes: "Обновлены данные калибровки",
  },
  {
    version: "3.0",
    date: "2024-10-28 16:45",
    author: "Петрова М.В.",
    changes: "Добавлен раздел с выводами",
  },
  {
    version: "2.0",
    date: "2024-10-15 09:30",
    author: "Иванов А.С.",
    changes: "Первичная версия протокола",
  },
];

const mockComments: Comment[] = [
  {
    id: 1,
    author: "Петрова М.В.",
    date: "2024-11-09 15:20",
    text: "Необходимо уточнить данные в разделе 3.2, показатели не соответствуют ожидаемым значениям",
    avatar: "ПМ",
  },
  {
    id: 2,
    author: "Сидоров В.П.",
    date: "2024-11-08 10:15",
    text: "Согласовано. Документ готов к утверждению.",
    avatar: "СВ",
  },
];

const DocumentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("preview");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const handleDownload = () => {
    toast({
      title: "Загрузка началась",
      description: `Файл "${mockDocument.title}" загружается...`,
    });
  };

  const handleShare = () => {
    toast({
      title: "Ссылка скопирована",
      description: "Ссылка на документ скопирована в буфер обмена",
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Ошибка",
        description: "Комментарий не может быть пустым",
        variant: "destructive",
      });
      return;
    }

    const newCommentObj: Comment = {
      id: comments.length + 1,
      author: "Иванов А.С.",
      date: new Date().toLocaleString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: newComment,
      avatar: "АИ",
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
    toast({
      title: "Комментарий добавлен",
      description: "Ваш комментарий успешно добавлен",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Документ удален",
      description: `Документ «${mockDocument.title}» был удален`,
    });
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
              <Icon name="ArrowLeft" size={20} />
              Назад к списку
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleDownload} className="gap-2">
                <Icon name="Download" size={16} />
                Скачать
              </Button>
              {mockDocument.permissions.canEdit && (
                <Button variant="outline" className="gap-2">
                  <Icon name="Edit" size={16} />
                  Редактировать
                </Button>
              )}
              <Button variant="outline" onClick={handleShare} className="gap-2">
                <Icon name="Share2" size={16} />
                Поделиться
              </Button>
              {mockDocument.permissions.canDelete && (
                <Button 
                  variant="outline" 
                  className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Icon name="Trash2" size={16} />
                  Удалить
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-semibold mb-2">{mockDocument.title}</h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icon name="User" size={14} />
                    {mockDocument.author}
                  </span>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="flex items-center gap-1">
                    <Icon name="Calendar" size={14} />
                    {mockDocument.lastModified}
                  </span>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="flex items-center gap-1">
                    <Icon name="GitBranch" size={14} />
                    Версия {mockDocument.version}
                  </span>
                </div>
              </div>
              <Badge className={getStatusColor(mockDocument.status)}>
                {getStatusText(mockDocument.status)}
              </Badge>
            </div>

            <div className="flex gap-2 flex-wrap">
              {mockDocument.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="preview">Предпросмотр</TabsTrigger>
              <TabsTrigger value="details">Детали</TabsTrigger>
              <TabsTrigger value="versions">История версий</TabsTrigger>
              <TabsTrigger value="comments">Комментарии ({comments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="mt-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Icon name="Eye" size={18} />
                    Предпросмотр документа
                  </h3>
                  <Badge variant="outline">{mockDocument.fileFormat}</Badge>
                </div>
                <div className="bg-muted rounded-lg border-2 border-dashed border-border p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="FileText" className="text-primary" size={40} />
                    </div>
                    <div>
                      <p className="text-lg font-medium mb-1">{mockDocument.title}</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {mockDocument.fileFormat} • {mockDocument.fileSize}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleDownload} className="gap-2">
                        <Icon name="Download" size={16} />
                        Скачать для просмотра
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Icon name="ExternalLink" size={16} />
                        Открыть в новой вкладке
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex gap-2">
                    <Icon name="Info" size={16} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p className="font-medium mb-1">Предпросмотр в браузере</p>
                      <p>Для полноценного просмотра PDF, Word и Excel файлов скачайте документ или откройте его в новой вкладке.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6 mt-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Icon name="FileText" size={18} />
                  Описание документа
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {mockDocument.description}
                </p>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Icon name="Info" size={18} />
                    Основная информация
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Тип документа</p>
                      <p className="font-medium">{mockDocument.type}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Проект</p>
                      <p className="font-medium">{mockDocument.project}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Дата создания</p>
                      <p className="font-medium">{mockDocument.createdDate}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Формат файла</p>
                      <p className="font-medium">{mockDocument.fileFormat}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Размер файла</p>
                      <p className="font-medium">{mockDocument.fileSize}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Icon name="Shield" size={18} />
                    Права доступа
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Просмотр</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <Icon name="Check" size={14} className="mr-1" />
                        Разрешено
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Редактирование</span>
                      {mockDocument.permissions.canEdit ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <Icon name="Check" size={14} className="mr-1" />
                          Разрешено
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700">
                          <Icon name="X" size={14} className="mr-1" />
                          Запрещено
                        </Badge>
                      )}
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Удаление</span>
                      {mockDocument.permissions.canDelete ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <Icon name="Check" size={14} className="mr-1" />
                          Разрешено
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700">
                          <Icon name="X" size={14} className="mr-1" />
                          Запрещено
                        </Badge>
                      )}
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Общий доступ</span>
                      {mockDocument.permissions.canShare ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <Icon name="Check" size={14} className="mr-1" />
                          Разрешено
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700">
                          <Icon name="X" size={14} className="mr-1" />
                          Запрещено
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="versions" className="mt-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Icon name="History" size={18} />
                  История изменений
                </h3>
                <div className="space-y-4">
                  {mockVersions.map((version, index) => (
                    <div key={index}>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <code className="text-sm font-semibold text-primary">
                            {version.version}
                          </code>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium">{version.author}</p>
                            <p className="text-sm text-muted-foreground">{version.date}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{version.changes}</p>
                          <div className="flex gap-2 mt-2">
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                              <Icon name="Download" size={14} />
                              Скачать
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                              <Icon name="Eye" size={14} />
                              Просмотреть
                            </Button>
                          </div>
                        </div>
                      </div>
                      {index < mockVersions.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="mt-6">
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Icon name="MessageSquarePlus" size={18} />
                    Добавить комментарий
                  </h3>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Напишите ваш комментарий..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleAddComment} className="gap-2">
                        <Icon name="Send" size={16} />
                        Отправить
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Icon name="MessageSquare" size={18} />
                    Комментарии ({comments.length})
                  </h3>
                  {comments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Icon name="MessageSquare" size={48} className="mx-auto mb-2 opacity-50" />
                      <p>Комментариев пока нет. Станьте первым!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <Avatar>
                            <AvatarFallback>{comment.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-sm">{comment.author}</p>
                              <p className="text-xs text-muted-foreground">{comment.date}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Icon name="AlertTriangle" size={20} className="text-destructive" />
              Удалить документ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить документ «{mockDocument.title}»? 
              Это действие нельзя отменить. Документ и все его версии будут удалены безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить документ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DocumentDetail;