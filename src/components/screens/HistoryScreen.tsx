
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Search, Edit, Trash2, Clock, Pill } from 'lucide-react';

export const HistoryScreen = () => {
  const { toast } = useToast();
  
  // 今日の日付をYYYY-MM-DD形式で取得
  const today = new Date().toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  // サンプルデータ
  const historyData = [
    {
      id: 1,
      date: '2024-01-15',
      time: '08:00',
      medications: [
        { name: 'ロキソニン錠60mg', dosage: '1錠', memo: '朝食後に服用' }
      ]
    },
    {
      id: 2,
      date: '2024-01-15',
      time: '12:30',
      medications: [
        { name: 'ガスター錠20mg', dosage: '1錠', memo: '' },
        { name: 'ムコダイン錠250mg', dosage: '2錠', memo: '水分多めに摂取' }
      ]
    }
  ];

  const handleEdit = (record: any) => {
    setEditingRecord(record);
  };

  const handleSaveEdit = () => {
    toast({
      title: "更新完了",
      description: "記録を更新しました。",
    });
    setEditingRecord(null);
  };

  const handleDelete = (recordId: number) => {
    toast({
      title: "削除完了",
      description: "記録を削除しました。",
    });
  };

  const handleSearch = () => {
    toast({
      title: "検索実行",
      description: `${startDate} から ${endDate} の記録を検索しました。`,
    });
  };

  const groupedData = historyData.reduce((acc: { [key: string]: any[] }, record) => {
    if (!acc[record.date]) {
      acc[record.date] = [];
    }
    acc[record.date].push(record);
    return acc;
  }, {});

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">服薬履歴</h2>
        <p className="text-sm sm:text-base text-gray-600">過去の服薬記録を確認できます</p>
      </div>

      {/* 検索フィルター */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-emerald-50">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            期間検索
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-2 block">
                開始日
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-sm font-medium text-gray-700 mb-2 block">
                終了日
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </div>
          <Button 
            onClick={handleSearch}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
          >
            <Search className="w-4 h-4 mr-2" />
            検索
          </Button>
        </CardContent>
      </Card>

      {/* 履歴一覧 */}
      <div className="space-y-4">
        {Object.entries(groupedData).map(([date, records]) => (
          <Card key={date} className="shadow-lg border-0 bg-gradient-to-br from-white to-emerald-50">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                {new Date(date).toLocaleDateString('ja-JP', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric', 
                  weekday: 'short' 
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {records.map((record) => (
                  <div key={record.id} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-emerald-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 text-emerald-600 font-medium">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm sm:text-base">{record.time}</span>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEdit(record)}
                              className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-xs sm:text-sm px-2 sm:px-3"
                            >
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              編集
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-base sm:text-lg">記録編集</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-700 mb-2 block">服用時刻</Label>
                                <Input type="time" defaultValue={record.time} className="text-sm" />
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700 mb-2 block">メモ</Label>
                                <Textarea 
                                  defaultValue={record.medications[0]?.memo || ''} 
                                  className="resize-none text-sm" 
                                  rows={3}
                                />
                              </div>
                              <Button 
                                onClick={handleSaveEdit}
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm"
                              >
                                保存
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-red-200 text-red-600 hover:bg-red-50 text-xs sm:text-sm px-2 sm:px-3"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              削除
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="w-[95vw] max-w-md">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-base">記録を削除しますか？</AlertDialogTitle>
                              <AlertDialogDescription className="text-sm">
                                この操作は取り消せません。本当に削除しますか？
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                              <AlertDialogCancel className="text-sm">キャンセル</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(record.id)}
                                className="bg-red-600 hover:bg-red-700 text-sm"
                              >
                                削除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {record.medications.map((med, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm sm:text-base">
                          <Pill className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="font-medium">{med.name}</span>
                          <span className="text-gray-600">({med.dosage})</span>
                          {med.memo && (
                            <span className="text-emerald-600 text-xs sm:text-sm">- {med.memo}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
